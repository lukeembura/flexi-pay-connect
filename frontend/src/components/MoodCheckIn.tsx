import { Card } from "@/components/ui/card";
import { ChevronRight, Cloud } from "lucide-react";

export function MoodCheckIn() {
  return (
    <Card className="p-6 bg-secondary/50 border-secondary/30 hover:shadow-gentle transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/30 p-3 rounded-full">
            <Cloud className="text-accent-foreground" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Mood Check-In</h3>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>
        </div>
        <ChevronRight 
          className="text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1" 
          size={20} 
        />
      </div>
    </Card>
  );
}