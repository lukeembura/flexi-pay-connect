import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MoodPatternsModal } from "./MoodPatternsModal";
import { JourneyProgressModal } from "./JourneyProgressModal";
import { CustomizationModal } from "./CustomizationModal";

export function YouPage() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [moodPatternsOpen, setMoodPatternsOpen] = useState(false);
  const [journeyProgressOpen, setJourneyProgressOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">🧠 You</h1>
        <p className="text-muted-foreground">Your personalization hub</p>
      </div>

      {/* Mood Patterns */}
      <Card 
        className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setMoodPatternsOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="font-medium text-foreground">Your Mood Patterns</h3>
          </div>
          <span className="text-muted-foreground">→</span>
        </div>
        <p className="text-sm text-muted-foreground">View insights from your daily check-ins</p>
      </Card>

      {/* Journey Progress */}
      <Card 
        className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setJourneyProgressOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <div>
              <h3 className="font-medium text-foreground">Your Journey Progress</h3>
              <p className="text-sm text-muted-foreground">Track your wellness journey</p>
            </div>
          </div>
          <span className="text-muted-foreground">→</span>
        </div>
        <Progress value={60} className="h-2 bg-muted" />
        <p className="text-xs text-muted-foreground mt-2">60% Complete</p>
      </Card>

      {/* Customize Your Space */}
      <Card 
        className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setCustomizationOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <div>
              <h3 className="font-medium text-foreground">Customize Your Space</h3>
              <p className="text-sm text-muted-foreground">Themes, Sounds, Notifications</p>
            </div>
          </div>
          <span className="text-muted-foreground">→</span>
        </div>
      </Card>

      {/* Upgrade Button */}
      <Card className="p-4 bg-primary/10 border-primary/30 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💎</span>
            <h3 className="font-medium text-primary">Upgrade to SereniYou+</h3>
          </div>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => navigate("/subscription")}
          >
            Upgrade
          </Button>
        </div>
      </Card>

      {/* Colors & Aesthetic */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌈</span>
          <h2 className="text-lg font-semibold text-foreground">Colors & Aesthetic</h2>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">• Soft lavender, blush pink, sage green</p>
          <p className="text-sm text-muted-foreground">• Calm animations (clouds, petals, breathing guides)</p>
          <p className="text-sm text-muted-foreground">• Gentle sounds (chimes, water, soft wind)</p>
        </div>
      </div>

      {/* Sign Out Button */}
      <Card className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl">
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          className="w-full flex items-center gap-2 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </Card>

      {/* Modals */}
      <MoodPatternsModal 
        open={moodPatternsOpen} 
        onOpenChange={setMoodPatternsOpen} 
      />
      <JourneyProgressModal 
        open={journeyProgressOpen} 
        onOpenChange={setJourneyProgressOpen} 
      />
      <CustomizationModal 
        open={customizationOpen} 
        onOpenChange={setCustomizationOpen} 
      />
    </div>
  );
}