import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Heart, Target, BarChart3, Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

interface MoodEntry {
  id: string;
  mood: string;
  created_at: string;
  notes?: string;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  tags?: string[];
}

export function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<{ mood: string; count: number; color: string }[]>([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    avgWordsPerEntry: 0,
    mostActiveDay: "",
    journalingGoal: 30
  });
  const [weeklyMood, setWeeklyMood] = useState<{ day: string; score: number }[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (user) {
      fetchInsightsData();
    }
  }, [user]);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      
      // Fetch mood entries from last 30 days
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
      
      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (moodError) throw moodError;

      // Fetch journal entries from last 30 days
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (journalError) throw journalError;

      setMoodEntries(moodData || []);
      setJournalEntries(journalData || []);

      // Process data for insights
      processMoodData(moodData || []);
      processWeeklyMood(moodData || []);
      calculateStats(moodData || [], journalData || []);
      
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMoodData = (entries: MoodEntry[]) => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const moodColors: Record<string, string> = {
      'happy': 'bg-green-500',
      'calm': 'bg-blue-500',
      'sad': 'bg-purple-500',
      'anxious': 'bg-orange-500',
      'angry': 'bg-red-500',
      'tired': 'bg-gray-500',
      'thoughtful': 'bg-indigo-500',
      'neutral': 'bg-slate-500',
      'grateful': 'bg-emerald-500',
      'peaceful': 'bg-cyan-500',
      'reflective': 'bg-violet-500',
      'energetic': 'bg-amber-500',
      'contemplative': 'bg-sky-500'
    };

    const processedData = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood: mood.charAt(0).toUpperCase() + mood.slice(1),
        count,
        color: moodColors[mood] || 'bg-gray-500'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 moods

    setMoodData(processedData);
  };

  const processWeeklyMood = (entries: MoodEntry[]) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const moodValues: Record<string, number> = {
      'very-sad': 1, 'sad': 2, 'anxious': 3, 'neutral': 4, 'tired': 5,
      'thoughtful': 6, 'calm': 7, 'peaceful': 8, 'happy': 9, 'grateful': 10
    };

    const weeklyData = weekDays.map((day, index) => {
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.getDay() === index;
      });

      if (dayEntries.length === 0) {
        return { day, score: 5 }; // Neutral score for no entries
      }

      const avgScore = dayEntries.reduce((sum, entry) => {
        return sum + (moodValues[entry.mood] || 5);
      }, 0) / dayEntries.length;

      return { day, score: Math.round(avgScore) };
    });

    setWeeklyMood(weeklyData);
  };

  const calculateStats = (moodEntries: MoodEntry[], journalEntries: JournalEntry[]) => {
    const totalEntries = moodEntries.length + journalEntries.length;
    
    // Calculate current streak
    const currentStreak = calculateCurrentStreak([...moodEntries, ...journalEntries]);
    
    // Calculate longest streak
    const longestStreak = calculateLongestStreak([...moodEntries, ...journalEntries]);
    
    // Calculate average words per journal entry
    const avgWordsPerEntry = journalEntries.length > 0 
      ? Math.round(journalEntries.reduce((sum, entry) => sum + entry.content.split(' ').length, 0) / journalEntries.length)
      : 0;
    
    // Find most active day
    const mostActiveDay = findMostActiveDay([...moodEntries, ...journalEntries]);

    setStats({
      totalEntries,
      currentStreak,
      longestStreak,
      avgWordsPerEntry,
      mostActiveDay,
      journalingGoal: 30
    });
  };

  const calculateCurrentStreak = (entries: (MoodEntry | JournalEntry)[]) => {
    if (entries.length === 0) return 0;
    
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    const today = startOfDay(currentDate);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = startOfDay(subDays(currentDate, i));
      const hasEntry = entries.some(entry => 
        startOfDay(new Date(entry.created_at)).getTime() === checkDate.getTime()
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (entries: (MoodEntry | JournalEntry)[]) => {
    if (entries.length === 0) return 0;
    
    const sortedEntries = entries.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    sortedEntries.forEach(entry => {
      const entryDate = startOfDay(new Date(entry.created_at));
      
      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor((entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      }
      
      lastDate = entryDate;
    });
    
    return Math.max(maxStreak, currentStreak);
  };

  const findMostActiveDay = (entries: (MoodEntry | JournalEntry)[]) => {
    if (entries.length === 0) return "No data";
    
    const dayCounts: Record<string, number> = {};
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    entries.forEach(entry => {
      const day = weekDays[new Date(entry.created_at).getDay()];
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    
    const mostActiveDay = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostActiveDay ? mostActiveDay[0] : "No data";
  };

  if (loading) {
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
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your insights...</p>
          </div>
        </div>
      </div>
    );
  }

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
      {moodData.length > 0 && (
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
      )}

      {/* Writing Stats */}
      {stats.avgWordsPerEntry > 0 && (
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
      )}

      {/* Additional Insights */}
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-4">Journey Highlights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Longest streak</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              {moodEntries.length > 0 ? Math.round((moodEntries.length / 30) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Mood tracking consistency</p>
          </div>
        </div>
      </Card>
    </div>
  );
}