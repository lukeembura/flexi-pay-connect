import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Phase = "inhale" | "hold" | "exhale" | "pause";

const phases: { [key in Phase]: { text: string; duration: number; color: string } } = {
  inhale: { text: "Breathe In", duration: 4000, color: "bg-primary" },
  hold: { text: "Hold", duration: 4000, color: "bg-accent" },
  exhale: { text: "Breathe Out", duration: 6000, color: "bg-secondary" },
  pause: { text: "Pause", duration: 2000, color: "bg-muted" },
};

interface BreathingExerciseProps {
  onClose: () => void;
}

export function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>("inhale");
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases.inhale.duration);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          // Move to next phase
          const phaseOrder: Phase[] = ["inhale", "hold", "exhale", "pause"];
          const currentIndex = phaseOrder.indexOf(currentPhase);
          const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
          
          if (nextPhase === "inhale") {
            setCycleCount(count => count + 1);
          }
          
          setCurrentPhase(nextPhase);
          return phases[nextPhase].duration;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentPhase]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase("inhale");
    setTimeLeft(phases.inhale.duration);
    setCycleCount(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(phases.inhale.duration);
  };

  const progress = ((phases[currentPhase].duration - timeLeft) / phases[currentPhase].duration) * 100;

  return (
    <Card className="p-8 bg-card text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Breathing Exercise</h2>
        <p className="text-muted-foreground">Follow the rhythm to calm your mind</p>
      </div>

      <div className="mb-8">
        <div className={`w-32 h-32 rounded-full mx-auto mb-4 transition-all duration-300 ${phases[currentPhase].color} flex items-center justify-center`}>
          <div 
            className="w-24 h-24 rounded-full bg-white/20 transition-all duration-300"
            style={{ 
              transform: isActive ? `scale(${0.8 + (progress / 100) * 0.4})` : 'scale(1)' 
            }}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-foreground">
            {phases[currentPhase].text}
          </h3>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Cycle: {cycleCount}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {!isActive ? (
          <Button onClick={handleStart} className="bg-primary hover:bg-primary/90">
            Start Breathing
          </Button>
        ) : (
          <Button onClick={handleStop} variant="secondary">
            Stop
          </Button>
        )}
      </div>
    </Card>
  );
}