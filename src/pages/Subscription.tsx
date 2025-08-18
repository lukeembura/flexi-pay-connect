import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { useNavigate } from "react-router-dom";

export function Subscription() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Subscription Plans</h1>
        </div>

        <SubscriptionPlans />
      </div>
    </div>
  );
}