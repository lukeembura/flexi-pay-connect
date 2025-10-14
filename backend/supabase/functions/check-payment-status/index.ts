import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { checkoutRequestId } = await req.json();
    
    if (!checkoutRequestId) {
      throw new Error("Checkout request ID is required");
    }

    // Query payment request status
    const { data: paymentRequest, error: queryError } = await supabaseClient
      .from("payment_requests")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .eq("user_id", userData.user.id)
      .single();

    if (queryError || !paymentRequest) {
      throw new Error("Payment request not found");
    }

    // Also check subscription status
    const { data: subscription } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    return new Response(JSON.stringify({
      status: paymentRequest.status,
      resultCode: paymentRequest.result_code,
      resultDescription: paymentRequest.result_description,
      transactionId: paymentRequest.transaction_id,
      subscribed: subscription?.subscribed || false,
      subscriptionTier: subscription?.subscription_tier,
      subscriptionEnd: subscription?.subscription_end
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Status check error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Status check failed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});