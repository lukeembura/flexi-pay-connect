import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      // TODO: Integrate with Daraja API for M-Pesa payments
      toast({
        title: "Coming Soon",
        description: "M-Pesa integration will be available shortly. Please check back soon!",
      });
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Unlock the full potential of your wellness journey
        </p>
      </div>

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