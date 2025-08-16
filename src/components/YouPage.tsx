import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function YouPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">🧠 You</h1>
        <p className="text-muted-foreground">Your personalization hub</p>
      </div>

      {/* Mood Patterns */}
      <Card className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🟣</span>
            <h3 className="font-medium text-foreground">Your Mood Patterns</h3>
          </div>
          <span className="text-muted-foreground">→</span>
        </div>
        <p className="text-sm text-muted-foreground">View insights from your daily check-ins</p>
      </Card>

      {/* Journey Progress */}
      <Card className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🟣</span>
            <div>
              <h3 className="font-medium text-foreground">Your Journey Progress</h3>
              <p className="text-sm text-muted-foreground">("Self-Worth Level 3")</p>
            </div>
          </div>
          <span className="text-muted-foreground">→</span>
        </div>
        <Progress value={60} className="h-2 bg-muted" />
        <p className="text-xs text-muted-foreground mt-2">60% Complete</p>
      </Card>

      {/* Customize Your Space */}
      <Card className="p-4 bg-secondary/20 border-secondary/30 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🟣</span>
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
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
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
    </div>
  );
}