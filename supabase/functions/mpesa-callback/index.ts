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
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const callbackData = await req.json();
    console.log("M-Pesa callback received:", JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      console.error("Invalid callback format");
      return new Response("Invalid callback format", { status: 400 });
    }

    const { stkCallback } = Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // Update payment request status
    const updateData: any = {
      result_code: ResultCode,
      result_description: ResultDesc,
      updated_at: new Date().toISOString()
    };

    if (ResultCode === 0) {
      // Payment successful
      updateData.status = "completed";
      
      // Extract transaction details
      if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
        const metadata = stkCallback.CallbackMetadata.Item;
        const transactionId = metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
        const transactionDate = metadata.find((item: any) => item.Name === "TransactionDate")?.Value;
        const phoneNumber = metadata.find((item: any) => item.Name === "PhoneNumber")?.Value;
        
        updateData.transaction_id = transactionId;
        updateData.transaction_date = transactionDate;
        updateData.phone_number = phoneNumber;
      }
    } else {
      // Payment failed
      updateData.status = "failed";
    }

    // Update the payment request
    const { data: paymentRequest, error: updateError } = await supabaseService
      .from("payment_requests")
      .update(updateData)
      .eq("checkout_request_id", CheckoutRequestID)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating payment request:", updateError);
      return new Response("Error updating payment", { status: 500 });
    }

    // If payment was successful, update user subscription
    if (ResultCode === 0 && paymentRequest) {
      const subscriptionEnd = new Date();
      if (paymentRequest.plan_id === "monthly") {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      } else if (paymentRequest.plan_id === "annual") {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
      }

      await supabaseService.from("subscribers").upsert({
        user_id: paymentRequest.user_id,
        email: paymentRequest.email || "unknown@example.com",
        subscribed: true,
        subscription_tier: paymentRequest.plan_id === "annual" ? "Annual Premium" : "Monthly Premium",
        subscription_end: subscriptionEnd.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      console.log("Subscription updated successfully for user:", paymentRequest.user_id);
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Callback processing error:", error);
    return new Response("Error processing callback", { status: 500 });
  }
});