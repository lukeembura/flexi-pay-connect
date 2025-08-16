import { Card } from "@/components/ui/card";
import { ChevronRight, Edit3 } from "lucide-react";

export function JournalPrompt() {
  return (
    <Card className="p-6 bg-accent/20 border-accent/30 hover:shadow-gentle transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/30 p-3 rounded-full">
            <Edit3 className="text-accent-foreground" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Journal Prompt</h3>
            <p className="text-muted-foreground italic">
              "What did your soul need today?"
            </p>
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