import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
function logStep(step: string, details?: any) {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[INITIATE-PAYMENT] ${step}${detailsStr}`);
}

// Helper function to get M-Pesa access token
async function getMpesaAccessToken() {
  logStep("Getting M-Pesa access token");
  
  const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
  const environment = Deno.env.get("MPESA_ENVIRONMENT");
  
  logStep("Environment variables", { 
    hasConsumerKey: !!consumerKey, 
    hasConsumerSecret: !!consumerSecret, 
    environment 
  });
  
  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa credentials not configured");
  }
  
  const baseUrl = environment === "sandbox" 
    ? "https://sandbox.safaricom.co.ke" 
    : "https://api.safaricom.co.ke";
  
  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  const tokenUrl = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
  
  logStep("Requesting access token", { tokenUrl });
  
  try {
    const response = await fetch(tokenUrl, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    logStep("Token response", { status: response.status, hasAccessToken: !!data.access_token });
    
    if (!response.ok) {
      logStep("Token request failed", { status: response.status, data });
      throw new Error(`Failed to get access token: ${data.errorMessage || data.error_description || "Unknown error"}`);
    }
    
    return data.access_token;
  } catch (error) {
    logStep("Token request error", { error: error.message });
    throw error;
  }
}

// Helper function to initiate STK Push
async function initiateStkPush(accessToken: string, phoneNumber: string, amount: number, accountReference: string) {
  logStep("Initiating STK Push", { phoneNumber, amount, accountReference });
  
  const shortcode = Deno.env.get("MPESA_SHORTCODE");
  const passkey = Deno.env.get("MPESA_PASSKEY");
  const environment = Deno.env.get("MPESA_ENVIRONMENT");
  
  logStep("STK Push config", { 
    hasShortcode: !!shortcode, 
    hasPasskey: !!passkey, 
    environment 
  });
  
  if (!shortcode || !passkey) {
    throw new Error("M-Pesa configuration missing");
  }
  
  const baseUrl = environment === "sandbox" 
    ? "https://sandbox.safaricom.co.ke" 
    : "https://api.safaricom.co.ke";
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = btoa(`${shortcode}${passkey}${timestamp}`);
  
  const stkPushData = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mpesa-callback`,
    AccountReference: accountReference,
    TransactionDesc: "SereniYou Subscription Payment"
  };
  
  const stkPushUrl = `${baseUrl}/mpesa/stkpush/v1/processrequest`;
  logStep("STK Push request", { url: stkPushUrl, timestamp });
  
  try {
    const response = await fetch(stkPushUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPushData),
    });
    
    const data = await response.json();
    logStep("STK Push response", { status: response.status, data });
    
    if (!response.ok) {
      logStep("STK Push failed", { status: response.status, data });
      throw new Error(`STK Push failed: ${data.errorMessage || data.errorDescription || "Unknown error"}`);
    }
    
    return data;
  } catch (error) {
    logStep("STK Push error", { error: error.message });
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment request started");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("Authentication failed", { userError });
      throw new Error("User not authenticated");
    }

    logStep("User authenticated", { userId: userData.user.id });

    const requestBody = await req.json();
    const { phoneNumber, planId } = requestBody;
    
    logStep("Request data", { phoneNumber, planId });
    
    if (!phoneNumber || !planId) {
      throw new Error("Phone number and plan ID are required");
    }

    // Validate phone number format (Kenyan format)
    const kenyanPhoneRegex = /^254[17]\d{8}$/;
    if (!kenyanPhoneRegex.test(phoneNumber)) {
      logStep("Invalid phone number format", { phoneNumber });
      throw new Error("Invalid phone number. Use format: 254XXXXXXXXX");
    }

    // Determine amount based on plan
    const amounts = {
      monthly: 2000,
      annual: 10000
    };
    
    const amount = amounts[planId as keyof typeof amounts];
    if (!amount) {
      logStep("Invalid plan", { planId });
      throw new Error("Invalid plan selected");
    }

    logStep("Plan validated", { planId, amount });

    // Get M-Pesa access token
    const accessToken = await getMpesaAccessToken();
    logStep("Access token obtained");
    
    // Create account reference (user ID + plan)
    const accountReference = `${userData.user.id.slice(0, 8)}-${planId}`;
    
    // Initiate STK Push
    const stkPushResponse = await initiateStkPush(
      accessToken,
      phoneNumber,
      amount,
      accountReference
    );

    logStep("STK Push successful", { checkoutRequestId: stkPushResponse.CheckoutRequestID });

    // Store payment request in database for tracking
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const insertResult = await supabaseService.from("payment_requests").insert({
      user_id: userData.user.id,
      checkout_request_id: stkPushResponse.CheckoutRequestID,
      merchant_request_id: stkPushResponse.MerchantRequestID,
      phone_number: phoneNumber,
      amount: amount,
      plan_id: planId,
      status: "pending",
      created_at: new Date().toISOString()
    });

    if (insertResult.error) {
      logStep("Database insert failed", { error: insertResult.error });
      throw new Error(`Database error: ${insertResult.error.message}`);
    }

    logStep("Payment request stored in database");

    return new Response(JSON.stringify({
      success: true,
      message: "Payment request sent. Please check your phone and enter your M-Pesa PIN.",
      checkoutRequestId: stkPushResponse.CheckoutRequestID
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Payment failed";
    logStep("Payment error", { error: errorMessage });
    console.error("Payment error:", error);
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});