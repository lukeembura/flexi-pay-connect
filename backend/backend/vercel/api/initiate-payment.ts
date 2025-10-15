import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const environment = (process.env.MPESA_ENVIRONMENT || 'production').toLowerCase();

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa credentials not configured');
  }

  const baseUrl = environment === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const tokenUrl = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

  const response = await fetch(tokenUrl, {
    method: 'GET',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.errorMessage || data.error_description || 'Unknown error'}`);
  }
  return data.access_token as string;
}

async function initiateStkPush(accessToken: string, phoneNumber: string, amount: number, accountReference: string) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const environment = (process.env.MPESA_ENVIRONMENT || 'production').toLowerCase();

  if (!shortcode || !passkey) throw new Error('M-Pesa configuration missing');

  const baseUrl = environment === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke';
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  const stkPushData = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: `${process.env.PUBLIC_BASE_URL}/api/mpesa-callback`,
    AccountReference: accountReference,
    TransactionDesc: 'SereniYou Subscription Payment',
  };

  const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(stkPushData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`STK Push failed: ${data.errorMessage || data.errorDescription || 'Unknown error'}`);
  }
  return data;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseClient = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { phoneNumber, planId } = req.body;
    if (!phoneNumber || !planId) {
      return res.status(400).json({ error: 'Phone number and plan ID are required' });
    }

    const kenyanPhoneRegex = /^254[17]\d{8}$/;
    if (!kenyanPhoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number. Use format: 254XXXXXXXXX' });
    }

    const amounts: Record<string, number> = { monthly: 2000, annual: 10000 };
    const amount = amounts[planId];
    if (!amount) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const accessToken = await getMpesaAccessToken();
    const accountReference = `${userData.user.id.slice(0, 8)}-${planId}`;
    const stkPushResponse = await initiateStkPush(accessToken, phoneNumber, amount, accountReference);

    const supabaseService = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      { auth: { persistSession: false } }
    );

    const insertResult = await supabaseService.from('payment_requests').insert({
      user_id: userData.user.id,
      checkout_request_id: stkPushResponse.CheckoutRequestID,
      merchant_request_id: stkPushResponse.MerchantRequestID,
      phone_number: phoneNumber,
      amount,
      plan_id: planId,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    
    if (insertResult.error) {
      return res.status(500).json({ error: `Database error: ${insertResult.error.message}` });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment request sent. Please check your phone and enter your M-Pesa PIN.',
      checkoutRequestId: stkPushResponse.CheckoutRequestID,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Payment failed' });
  }
}