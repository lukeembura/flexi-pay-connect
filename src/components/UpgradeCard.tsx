import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function UpgradeCard() {
  return (
    <Card className="p-6 bg-gradient-primary border-0 text-center shadow-glow">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white/20 p-3 rounded-full animate-breathe">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Unlock Your Full Journey
          </h3>
          <p className="text-white/90 text-sm mb-4">
            Get access to exclusive healing journeys, personalized insights, and premium meditation guides.
          </p>
          <Button 
            variant="secondary" 
            className="bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            Upgrade to SereniYou+
          </Button>
        </div>
      </div>
    </Card>
  );
}