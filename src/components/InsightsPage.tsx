import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Heart, Target, BarChart3, Zap } from "lucide-react";

export function InsightsPage() {
  const moodData = [
    { mood: "Grateful", count: 12, color: "bg-green-500" },
    { mood: "Peaceful", count: 8, color: "bg-blue-500" },
    { mood: "Reflective", count: 6, color: "bg-purple-500" },
    { mood: "Energetic", count: 4, color: "bg-orange-500" },
    { mood: "Contemplative", count: 3, color: "bg-indigo-500" }
  ];

  const stats = {
    totalEntries: 33,
    currentStreak: 7,
    longestStreak: 14,
    avgWordsPerEntry: 247,
    mostActiveDay: "Sunday",
    journalingGoal: 30
  };

  const weeklyMood = [
    { day: "Mon", score: 7 },
    { day: "Tue", score: 8 },
    { day: "Wed", score: 6 },
    { day: "Thu", score: 9 },
    { day: "Fri", score: 7 },
    { day: "Sat", score: 8 },
    { day: "Sun", score: 9 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Insights
        </h1>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          This Month
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalEntries}</p>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Monthly Goal
          </h3>
          <span className="text-sm text-muted-foreground">
            {stats.totalEntries}/{stats.journalingGoal}
          </span>
        </div>
        <Progress value={(stats.totalEntries / stats.journalingGoal) * 100} className="mb-2" />
        <p className="text-xs text-muted-foreground">
          You're {Math.round((stats.totalEntries / stats.journalingGoal) * 100)}% towards your monthly goal!
        </p>
      </Card>

      {/* Weekly Mood Trend */}
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Weekly Mood Trend
        </h3>
        <div className="space-y-3">
          {weeklyMood.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground w-8">
                {day.day}
              </span>
              <div className="flex-1 bg-muted rounded-full h-2 relative">
                <div
                  className="bg-gradient-to-r from-primary/60 to-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(day.score / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-6">
                {day.score}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Mood Distribution */}
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-4">Most Common Moods</h3>
        <div className="space-y-3">
          {moodData.map((item) => (
            <div key={item.mood} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium text-foreground">{item.mood}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{item.count}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round((item.count / stats.totalEntries) * 100)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Writing Stats */}
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-4">Writing Patterns</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{stats.avgWordsPerEntry}</p>
            <p className="text-xs text-muted-foreground">Avg words per entry</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{stats.mostActiveDay}</p>
            <p className="text-xs text-muted-foreground">Most active day</p>
          </div>
        </div>
      </Card>
    </div>
  );
}