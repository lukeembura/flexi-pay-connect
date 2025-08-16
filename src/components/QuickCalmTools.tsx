import { Card } from "@/components/ui/card";
import { ChevronRight, Wind, Anchor } from "lucide-react";

interface QuickCalmToolProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function QuickCalmTool({ icon, title, description, color }: QuickCalmToolProps) {
  return (
    <Card className={`p-4 ${color} border-0 hover:shadow-gentle transition-all duration-300 cursor-pointer group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full animate-breathe">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
        <ChevronRight 
          className="text-white/80 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1" 
          size={16} 
        />
      </div>
    </Card>
  );
}

export function QuickCalmTools() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Quick Calm</h2>
      <div className="space-y-3">
        <QuickCalmTool
          icon={<Wind className="text-white" size={20} />}
          title="Breathe"
          description="3 min"
          color="bg-primary"
        />
        <QuickCalmTool
          icon={<Anchor className="text-white" size={20} />}
          title="Ground"
          description="5 min"
          color="bg-calm-mint"
        />
      </div>
    </div>
  );
}