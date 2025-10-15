import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const supabaseClient = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No authorization header provided' });

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) return res.status(401).json({ error: 'User not authenticated' });

    const checkoutRequestId = (req.body && (req.body as any).checkoutRequestId) || (req.query.checkoutRequestId as string);
    if (!checkoutRequestId) return res.status(400).json({ error: 'Checkout request ID is required' });

    const { data: paymentRequest, error: queryError } = await supabaseClient
      .from('payment_requests')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .eq('user_id', userData.user.id)
      .single();
    if (queryError || !paymentRequest) return res.status(404).json({ error: 'Payment request not found' });

    const { data: subscription } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    return res.status(200).json({
      status: paymentRequest.status,
      resultCode: paymentRequest.result_code,
      resultDescription: paymentRequest.result_description,
      transactionId: paymentRequest.transaction_id,
      subscribed: subscription?.subscribed || false,
      subscriptionTier: subscription?.subscription_tier,
      subscriptionEnd: subscription?.subscription_end,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Status check failed' });
  }
}

