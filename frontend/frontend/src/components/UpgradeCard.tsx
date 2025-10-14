import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UpgradeCard() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-gradient-primary border-0 text-center shadow-glow">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-card/20 p-3 rounded-full animate-breathe">
          <Sparkles className="text-card-foreground" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Unlock Your Full Journey
          </h3>
          <p className="text-card-foreground/90 text-sm mb-4">
            Starting from KSH 2,000/month. Get unlimited access to premium features.
          </p>
          <Button 
            variant="secondary" 
            className="bg-card text-primary hover:bg-card/90 transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/subscription")}
          >
            View Plans
          </Button>
        </div>
      </div>
    </Card>
  );
}