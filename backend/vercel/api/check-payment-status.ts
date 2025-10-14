import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(res: Response, body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Using Node.js runtime

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json(new Response(), { error: 'No authorization header provided' }, 401);

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) return json(new Response(), { error: 'User not authenticated' }, 401);

    const { checkoutRequestId } = await req.json();
    if (!checkoutRequestId) return json(new Response(), { error: 'Checkout request ID is required' }, 400);

    const { data: paymentRequest, error: queryError } = await supabaseClient
      .from('payment_requests')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .eq('user_id', userData.user.id)
      .single();
    if (queryError || !paymentRequest) return json(new Response(), { error: 'Payment request not found' }, 404);

    const { data: subscription } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    return json(new Response(), {
      status: paymentRequest.status,
      resultCode: paymentRequest.result_code,
      resultDescription: paymentRequest.result_description,
      transactionId: paymentRequest.transaction_id,
      subscribed: subscription?.subscribed || false,
      subscriptionTier: subscription?.subscription_tier,
      subscriptionEnd: subscription?.subscription_end,
    });
  } catch (e: any) {
    return json(new Response(), { error: e?.message || 'Status check failed' }, 500);
  }
}

