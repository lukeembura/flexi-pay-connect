import { Card } from "@/components/ui/card";
import { BreathingExercise } from "./BreathingExercise";
import { GroundingExercise } from "./GroundingExercise";
import { useState } from "react";

interface CalmToolProps {
  icon: string;
  title: string;
  duration: string;
  color: string;
  onClick?: () => void;
}

function CalmTool({ icon, title, duration, color, onClick }: CalmToolProps) {
  return (
    <Card className={`p-4 ${color} border-0 hover:shadow-gentle transition-all duration-300 cursor-pointer group rounded-2xl`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl animate-breathe">{icon}</div>
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-white/80 text-sm">{duration}</p>
          </div>
        </div>
        <div className="text-white/80 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1">
          →
        </div>
      </div>
    </Card>
  );
}

export function QuickCalmTools() {
  const [showBreathing, setShowBreathing] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);

  if (showBreathing) {
    return <BreathingExercise onClose={() => setShowBreathing(false)} />;
  }

  if (showGrounding) {
    return <GroundingExercise onClose={() => setShowGrounding(false)} />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Quick Calm</h2>
      <div className="space-y-3">
        <CalmTool
          icon="🧘‍♀️"
          title="Breathe"
          duration="3 min"
          color="bg-primary"
          onClick={() => setShowBreathing(true)}
        />
        <CalmTool
          icon="🧘‍♀️"
          title="Ground"
          duration="5 min"
          color="bg-calm-mint"
          onClick={() => setShowGrounding(true)}
        />
      </div>
    </div>
  );
}