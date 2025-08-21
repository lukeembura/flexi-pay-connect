import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface GroundingExerciseProps {
  onClose: () => void;
}

const groundingSteps = [
  {
    title: "5 things you can see",
    instruction: "Look around and name 5 things you can see. Take your time with each one.",
    icon: "👀"
  },
  {
    title: "4 things you can touch",
    instruction: "Notice 4 different textures or surfaces around you. Feel their temperature and texture.",
    icon: "✋"
  },
  {
    title: "3 things you can hear",
    instruction: "Listen carefully and identify 3 different sounds around you.",
    icon: "👂"
  },
  {
    title: "2 things you can smell",
    instruction: "Take a deep breath and notice 2 different scents.",
    icon: "👃"
  },
  {
    title: "1 thing you can taste",
    instruction: "Notice any taste in your mouth or take a sip of something nearby.",
    icon: "👅"
  }
];

export function GroundingExercise({ onClose }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (currentStep < groundingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-calm-mint/20 to-primary/10 border-calm-mint/30 rounded-2xl">
        <div className="text-6xl mb-4">🌱</div>
        <h2 className="text-2xl font-semibold text-foreground">Well Done!</h2>
        <p className="text-muted-foreground leading-relaxed">
          You've successfully grounded yourself using the 5-4-3-2-1 technique. 
          Notice how you feel more present and centered now.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleRestart} variant="outline">
            Practice Again
          </Button>
          <Button onClick={onClose}>
            Continue
          </Button>
        </div>
      </Card>
    );
  }

  const step = groundingSteps[currentStep];
  const progress = ((currentStep + 1) / groundingSteps.length) * 100;

  return (
    <Card className="p-8 space-y-6 bg-gradient-to-br from-calm-mint/20 to-primary/10 border-calm-mint/30 rounded-2xl">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentStep + 1} of {groundingSteps.length}
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">{step.icon}</div>
        <h2 className="text-2xl font-semibold text-foreground">{step.title}</h2>
        <p className="text-muted-foreground text-lg leading-relaxed px-4">
          {step.instruction}
        </p>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleNext}
          className="px-8 py-3 text-lg font-medium"
          size="lg"
        >
          {currentStep < groundingSteps.length - 1 ? "Next" : "Complete"}
        </Button>
      </div>
    </Card>
  );
}