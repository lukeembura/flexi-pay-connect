import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using Node.js runtime

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseService = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      { auth: { persistSession: false } }
    );

    const callbackData = await req.json();
    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      return new Response('Invalid callback format', { status: 400 });
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
      return new Response('Error updating payment', { status: 500 });
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

    return new Response('OK', { status: 200 });
  } catch (e) {
    return new Response('Error processing callback', { status: 500 });
  }
}

