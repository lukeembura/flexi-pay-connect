import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MoodPatternsModal } from "./MoodPatternsModal";
import { JourneyProgressModal } from "./JourneyProgressModal";
import { CustomizationModal } from "./CustomizationModal";
import { FlowerTheme } from "./FlowerTheme";

export function YouPage() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [moodPatternsOpen, setMoodPatternsOpen] = useState(false);
  const [journeyProgressOpen, setJourneyProgressOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const isFlowerTheme = settings.colorScheme === 'blush';

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
    <>
      <FlowerTheme />
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center relative">
          {isFlowerTheme && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flower-float">
              <div className="text-3xl">🌸</div>
            </div>
          )}
          <h1 className="text-2xl font-semibold text-foreground text-visible mb-2">
            {isFlowerTheme ? '🌸 You 🌸' : '🧠 You'}
          </h1>
          <p className="text-muted-foreground text-muted-visible">
            {isFlowerTheme ? 'Your blossoming personalization garden' : 'Your personalization hub'}
          </p>
          {isFlowerTheme && (
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-pink-300">🌺</span>
              <span className="text-rose-300">🌹</span>
              <span className="text-pink-300">🌷</span>
            </div>
          )}
        </div>

      {/* Mood Patterns */}
      <Card 
        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
          isFlowerTheme 
            ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 hover:from-pink-100 hover:to-rose-100 shadow-lg hover:shadow-xl' 
            : 'bg-secondary/20 border-secondary/30 hover:bg-secondary/30'
        }`}
        onClick={() => setMoodPatternsOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isFlowerTheme ? '🌸' : '📊'}</span>
            <h3 className="font-medium text-foreground text-visible">Your Mood Patterns</h3>
          </div>
          <span className="text-muted-foreground text-muted-visible">→</span>
        </div>
        <p className="text-sm text-muted-foreground text-muted-visible">
          {isFlowerTheme ? 'Watch your emotional garden bloom with insights' : 'View insights from your daily check-ins'}
        </p>
        {isFlowerTheme && (
          <div className="absolute top-2 right-2 opacity-20">
            <span className="text-pink-300 text-2xl">🌺</span>
          </div>
        )}
      </Card>

      {/* Journey Progress */}
      <Card 
        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
          isFlowerTheme 
            ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:from-rose-100 hover:to-pink-100 shadow-lg hover:shadow-xl' 
            : 'bg-secondary/20 border-secondary/30 hover:bg-secondary/30'
        }`}
        onClick={() => setJourneyProgressOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isFlowerTheme ? '🌱' : '🚀'}</span>
            <div>
              <h3 className="font-medium text-foreground text-visible">Your Journey Progress</h3>
              <p className="text-sm text-muted-foreground text-muted-visible">
                {isFlowerTheme ? 'Watch your wellness garden grow' : 'Track your wellness journey'}
              </p>
            </div>
          </div>
          <span className="text-muted-foreground text-muted-visible">→</span>
        </div>
        <Progress value={60} className={`h-2 ${isFlowerTheme ? 'bg-pink-100' : 'bg-muted'}`} />
        <p className="text-xs text-muted-foreground text-muted-visible mt-2">
          {isFlowerTheme ? '🌺 60% Bloomed' : '60% Complete'}
        </p>
        {isFlowerTheme && (
          <div className="absolute top-2 right-2 opacity-20">
            <span className="text-rose-300 text-2xl">🌹</span>
          </div>
        )}
      </Card>

      {/* Customize Your Space */}
      <Card 
        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
          isFlowerTheme 
            ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 hover:from-pink-100 hover:to-rose-100 shadow-lg hover:shadow-xl' 
            : 'bg-secondary/20 border-secondary/30 hover:bg-secondary/30'
        }`}
        onClick={() => setCustomizationOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isFlowerTheme ? '🌷' : '⚙️'}</span>
            <div>
              <h3 className="font-medium text-foreground text-visible">Customize Your Space</h3>
              <p className="text-sm text-muted-foreground text-muted-visible">
                {isFlowerTheme ? 'Design your blossoming sanctuary' : 'Themes, Sounds, Notifications'}
              </p>
            </div>
          </div>
          <span className="text-muted-foreground text-muted-visible">→</span>
        </div>
        {isFlowerTheme && (
          <div className="absolute top-2 right-2 opacity-20">
            <span className="text-pink-300 text-2xl">🌷</span>
          </div>
        )}
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate("/subscription")}
          >
            Upgrade
          </Button>
        </div>
      </Card>

      {/* Colors & Aesthetic */}
      <Card className={`p-4 rounded-2xl ${
        isFlowerTheme 
          ? 'bg-gradient-to-br from-pink-50/50 to-rose-50/50 border-pink-200/50' 
          : 'bg-secondary/10 border-secondary/20'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isFlowerTheme ? '🌸' : '🌈'}</span>
            <h2 className="text-lg font-semibold text-foreground text-visible">
              {isFlowerTheme ? 'Flower Garden Aesthetic' : 'Colors & Aesthetic'}
            </h2>
          </div>
          
          <div className="space-y-2">
            {isFlowerTheme ? (
              <>
                <p className="text-sm text-muted-foreground text-muted-visible flex items-center gap-2">
                  <span className="text-pink-400">🌸</span>
                  Blossoming cherry blossoms and rose gardens
                </p>
                <p className="text-sm text-muted-foreground text-muted-visible flex items-center gap-2">
                  <span className="text-rose-400">🌺</span>
                  Gentle petal animations and floating flowers
                </p>
                <p className="text-sm text-muted-foreground text-muted-visible flex items-center gap-2">
                  <span className="text-pink-400">🌷</span>
                  Soft pink gradients and floral patterns
                </p>
                <p className="text-sm text-muted-foreground text-muted-visible flex items-center gap-2">
                  <span className="text-rose-400">🌹</span>
                  Calming flower-themed sounds and visuals
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-muted-visible">• Soft lavender, blush pink, sage green</p>
                <p className="text-sm text-muted-foreground text-muted-visible">• Calm animations (clouds, petals, breathing guides)</p>
                <p className="text-sm text-muted-foreground text-muted-visible">• Gentle sounds (chimes, water, soft wind)</p>
              </>
            )}
          </div>
          
          {isFlowerTheme && (
            <div className="flex justify-center gap-3 pt-2">
              <div className="w-3 h-3 bg-pink-300 rounded-full flower-glow"></div>
              <div className="w-3 h-3 bg-rose-300 rounded-full flower-glow" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full flower-glow" style={{ animationDelay: '1s' }}></div>
              <div className="w-3 h-3 bg-rose-400 rounded-full flower-glow" style={{ animationDelay: '1.5s' }}></div>
            </div>
          )}
        </div>
      </Card>

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
    </>
  );
}