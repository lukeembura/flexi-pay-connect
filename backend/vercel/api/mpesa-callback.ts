import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const supabaseService = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      { auth: { persistSession: false } }
    );

    const callbackData = req.body;
    const Body = (callbackData as any)?.Body;
    if (!Body || !Body.stkCallback) {
      return res.status(400).send('Invalid callback format');
    }

    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    const updateData: any = {
      result_code: ResultCode,
      result_description: ResultDesc,
      updated_at: new Date().toISOString(),
    };

    if (ResultCode === 0) {
      updateData.status = 'completed';
      if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
        const metadata = stkCallback.CallbackMetadata.Item;
        const transactionId = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        const transactionDate = metadata.find((item: any) => item.Name === 'TransactionDate')?.Value;
        const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;
        updateData.transaction_id = transactionId;
        updateData.transaction_date = transactionDate;
        updateData.phone_number = phoneNumber;
      }
    } else {
      updateData.status = 'failed';
    }

    const { data: paymentRequest, error: updateError } = await supabaseService
      .from('payment_requests')
      .update(updateData)
      .eq('checkout_request_id', CheckoutRequestID)
      .select()
      .single();

    if (updateError) {
      return res.status(500).send('Error updating payment');
    }

    if (ResultCode === 0 && paymentRequest) {
      const subscriptionEnd = new Date();
      if (paymentRequest.plan_id === 'monthly') subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      else if (paymentRequest.plan_id === 'annual') subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

      await supabaseService.from('subscribers').upsert(
        {
          user_id: paymentRequest.user_id,
          email: paymentRequest.email || 'unknown@example.com',
          subscribed: true,
          subscription_tier: paymentRequest.plan_id === 'annual' ? 'Annual Premium' : 'Monthly Premium',
          subscription_end: subscriptionEnd.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    }

    return res.status(200).send('OK');
  } catch (e) {
    return res.status(500).send('Error processing callback');
  }
}

