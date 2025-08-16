import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export function DailyAffirmation() {
  return (
    <Card className="p-6 bg-gradient-secondary border-0 text-center shadow-gentle">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white/20 p-3 rounded-full animate-gentle-pulse">
          <Heart className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Affirmation of the Day
          </h3>
          <p className="text-white/90 text-lg font-medium leading-relaxed">
            "I am enough, as I am, right now."
          </p>
        </div>
      </div>
    </Card>
  );
}