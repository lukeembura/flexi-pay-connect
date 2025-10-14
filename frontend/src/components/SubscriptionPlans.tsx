import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Crown, Sparkles, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  icon: typeof Crown | typeof Sparkles;
}

const plans: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly Premium",
    price: 2000,
    period: "month",
    description: "Perfect for getting started with premium features",
    icon: Sparkles,
    features: [
      { text: "Unlimited journal entries", included: true },
      { text: "Advanced mood insights", included: true },
      { text: "Premium meditation guides", included: true },
      { text: "Daily affirmations", included: true },
      { text: "Progress tracking", included: true },
      { text: "Export journal data", included: true }
    ]
  },
  {
    id: "annual",
    name: "Annual Premium",
    price: 10000,
    period: "year",
    description: "Best value - Save KSH 14,000 per year!",
    icon: Crown,
    popular: true,
    features: [
      { text: "Everything in Monthly", included: true },
      { text: "Priority support", included: true },
      { text: "Exclusive content library", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Custom themes", included: true },
      { text: "2 months free!", included: true }
    ]
  }
];

export function SubscriptionPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  const handleSubscribe = async (planId: string) => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your M-Pesa phone number",
        variant: "destructive",
      });
      return;
    }

    const phoneRegex = /^254[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please use format: 254XXXXXXXXX (e.g., 254712345678)",
        variant: "destructive",
      });
      return;
    }

    if (!apiBaseUrl) {
      toast({ title: "Missing configuration", description: "VITE_API_BASE_URL is not set", variant: "destructive" });
      return;
    }

    setLoading(planId);
    setSelectedPlan(planId);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(`${apiBaseUrl}/api/initiate-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ phoneNumber, planId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      toast({
        title: "Payment Request Sent",
        description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
      });

      setPaymentStatus("pending");
      const checkoutRequestId = data.checkoutRequestId;
      pollPaymentStatus(checkoutRequestId);

    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        if (!apiBaseUrl) return;
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (!accessToken) throw new Error("User not authenticated");

        const res = await fetch(`${apiBaseUrl}/api/check-payment-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ checkoutRequestId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Status check failed");

        if (data.status === "completed" && data.resultCode === 0) {
          setPaymentStatus("success");
          toast({
            title: "Payment Successful!",
            description: `Welcome to ${data.subscriptionTier}! Your subscription is now active.`,
          });
          return;
        } else if (data.status === "failed") {
          setPaymentStatus("failed");
          toast({
            title: "Payment Failed",
            description: data.resultDescription || "Payment was not completed.",
            variant: "destructive",
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000);
        } else {
          setPaymentStatus("timeout");
          toast({
            title: "Payment Status Unknown",
            description: "Please check your M-Pesa messages and contact support if payment was deducted.",
            variant: "destructive",
          });
        }
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000);
        }
      }
    };

    checkStatus();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Unlock the full potential of your wellness journey
        </p>
      </div>

      {/* Phone Number Input */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Phone className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">M-Pesa Payment Details</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">M-Pesa Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="254712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
          </p>
        </div>
      </Card>

      {paymentStatus === "pending" && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-blue-800 font-medium">Processing Payment...</p>
            <p className="text-sm text-blue-600">Please complete the payment on your phone</p>
          </div>
        </Card>
      )}

      {paymentStatus === "success" && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="text-center">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Payment Successful!</p>
            <p className="text-sm text-green-600">Your subscription is now active</p>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          
          return (
            <Card
              key={plan.id}
              className={`relative p-6 ${
                plan.popular 
                  ? "border-primary shadow-glow bg-gradient-to-br from-card to-primary/5" 
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? "bg-primary/20" : "bg-muted"}`}>
                    <IconComponent className={`w-6 h-6 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold">KSH {plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                {loading === plan.id ? "Processing..." : "Subscribe Now"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-3">
                Pay securely with M-Pesa
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}