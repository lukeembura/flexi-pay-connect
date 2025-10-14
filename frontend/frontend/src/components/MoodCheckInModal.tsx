import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [notes, setNotes] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your mood",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("mood_entries").insert({
        user_id: user.id,
        mood: selectedMood,
        notes: notes.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Mood saved! 🎉",
        description: "Your mood has been recorded successfully",
      });

      setSelectedMood("");
      setNotes("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Add a note (optional)
        </label>
        <Textarea
          placeholder="How are you feeling? What's on your mind?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedMood || isSubmitting}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "Saving..." : "Save Mood"}
        </Button>
      </div>
    </Card>
  );
}