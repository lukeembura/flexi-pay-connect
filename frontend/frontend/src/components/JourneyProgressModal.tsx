import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays } from "date-fns";

interface JourneyProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProgressData {
  moodEntries: number;
  journalEntries: number;
  breathingExercises: number;
  totalDays: number;
}

export function JourneyProgressModal({ open, onOpenChange }: JourneyProgressModalProps) {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData>({
    moodEntries: 0,
    journalEntries: 0,
    breathingExercises: 0,
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && user) {
      fetchProgressData();
    }
  }, [open, user]);

  const fetchProgressData = async () => {
    try {
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      // Fetch mood entries
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Fetch journal entries
      const { data: journalData } = await supabase
        .from('journal_entries')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate unique active days
      const allDates = [
        ...(moodData || []).map(entry => format(new Date(entry.created_at), 'yyyy-MM-dd')),
        ...(journalData || []).map(entry => format(new Date(entry.created_at), 'yyyy-MM-dd'))
      ];
      const uniqueDays = new Set(allDates).size;

      setProgressData({
        moodEntries: moodData?.length || 0,
        journalEntries: journalData?.length || 0,
        breathingExercises: Math.floor(Math.random() * 15) + 5, // Simulated for now
        totalDays: uniqueDays
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLevel = () => {
    const totalActivities = progressData.moodEntries + progressData.journalEntries + progressData.breathingExercises;
    if (totalActivities >= 50) return { level: 5, name: "Mindfulness Master" };
    if (totalActivities >= 30) return { level: 4, name: "Wellness Warrior" };
    if (totalActivities >= 20) return { level: 3, name: "Self-Worth Explorer" };
    if (totalActivities >= 10) return { level: 2, name: "Mindful Beginner" };
    return { level: 1, name: "Starting Journey" };
  };

  const calculateOverallProgress = () => {
    const totalActivities = progressData.moodEntries + progressData.journalEntries + progressData.breathingExercises;
    return Math.min((totalActivities / 50) * 100, 100);
  };

  const getNextLevelRequirement = () => {
    const currentLevel = calculateLevel().level;
    const requirements = [10, 20, 30, 50, 100];
    if (currentLevel >= 5) return null;
    return requirements[currentLevel - 1];
  };

  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first mood check-in",
      earned: progressData.moodEntries > 0,
      icon: "🌱"
    },
    {
      name: "Reflection Master",
      description: "Write 5 journal entries",
      earned: progressData.journalEntries >= 5,
      icon: "📝"
    },
    {
      name: "Consistent Tracker",
      description: "Active for 7 days",
      earned: progressData.totalDays >= 7,
      icon: "🗓️"
    },
    {
      name: "Mindful Breather",
      description: "Complete 10 breathing exercises",
      earned: progressData.breathingExercises >= 10,
      icon: "🫁"
    }
  ];

  const currentLevel = calculateLevel();
  const overallProgress = calculateOverallProgress();
  const nextRequirement = getNextLevelRequirement();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            Your Journey Progress
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading your progress...</div>
        ) : (
          <div className="space-y-6">
            {/* Current Level */}
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="text-center">
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="text-xl font-semibold mb-1">Level {currentLevel.level}</h3>
                <p className="text-primary font-medium">{currentLevel.name}</p>
                <div className="mt-4">
                  <Progress value={overallProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(overallProgress)}% progress to next level
                  </p>
                  {nextRequirement && (
                    <p className="text-xs text-muted-foreground">
                      {nextRequirement - (progressData.moodEntries + progressData.journalEntries + progressData.breathingExercises)} more activities needed
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Activity Stats */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Activity Summary (Last 30 Days)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">😊</div>
                  <p className="text-xl font-bold text-primary">{progressData.moodEntries}</p>
                  <p className="text-sm text-muted-foreground">Mood Check-ins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="text-xl font-bold text-primary">{progressData.journalEntries}</p>
                  <p className="text-sm text-muted-foreground">Journal Entries</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🫁</div>
                  <p className="text-xl font-bold text-primary">{progressData.breathingExercises}</p>
                  <p className="text-sm text-muted-foreground">Breathing Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📅</div>
                  <p className="text-xl font-bold text-primary">{progressData.totalDays}</p>
                  <p className="text-sm text-muted-foreground">Active Days</p>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{achievement.name}</p>
                          {achievement.earned && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Goal */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">This Week's Goal</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="font-medium">Stay Consistent</p>
                  <p className="text-sm text-muted-foreground">
                    Try to check in with your mood daily and journal at least 3 times this week
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}