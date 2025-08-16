import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const moodEmojis = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "🤔", label: "Thoughtful", value: "thoughtful" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
];

export function MoodCheckInModal() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    // Handle mood submission
    console.log("Mood selected:", selectedMood);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="p-4 bg-secondary/30 border-secondary/50 hover:shadow-gentle transition-all duration-300 cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">☀️</div>
            <div>
              <h3 className="font-medium text-foreground">Mood Check-In</h3>
              <p className="text-sm text-muted-foreground">How are you feeling today?</p>
            </div>
          </div>
          <div className="text-muted-foreground">→</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card shadow-gentle">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">How are you feeling today?</h2>
        <p className="text-muted-foreground">Select the emoji that best describes your mood</p>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        {moodEmojis.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              selectedMood === mood.value
                ? "bg-primary/20 border-2 border-primary scale-105"
                : "bg-muted/30 border border-border hover:bg-muted/50"
            }`}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div className="text-xs text-muted-foreground">{mood.label}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedMood}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Save Mood
        </Button>
      </div>
    </Card>
  );
}