import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MoodEntry {
  id: string;
  mood: string;
  created_at: string;
  notes?: string;
}

interface MoodPatternsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoodPatternsModal({ open, onOpenChange }: MoodPatternsModalProps) {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && user) {
      fetchMoodEntries();
    }
  }, [open, user]);

  const fetchMoodEntries = async () => {
    try {
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodChartData = () => {
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      emoji: getMoodEmoji(mood)
    }));
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap: Record<string, string> = {
      'very-happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'very-sad': '😭'
    };
    return emojiMap[mood] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const colorMap: Record<string, string> = {
      'very-happy': '#10b981',
      'happy': '#22c55e',
      'neutral': '#6b7280',
      'sad': '#f59e0b',
      'very-sad': '#ef4444'
    };
    return colorMap[mood] || '#6b7280';
  };

  const getRecentTrend = () => {
    if (moodEntries.length < 2) return null;
    
    const recent = moodEntries.slice(0, 7);
    const moodValues = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5
    };
    
    const avgRecent = recent.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0) / recent.length;
    const older = moodEntries.slice(7, 14);
    const avgOlder = older.length > 0 ? older.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0) / older.length : avgRecent;
    
    if (avgRecent > avgOlder) return 'improving';
    if (avgRecent < avgOlder) return 'declining';
    return 'stable';
  };

  const trend = getRecentTrend();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            Your Mood Patterns
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading your mood insights...</div>
        ) : moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No mood entries yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Start tracking your daily mood to see patterns!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Trend Summary */}
            <Card className="p-4">
              <h3 className="font-medium mb-2">Recent Trend</h3>
              <div className="flex items-center gap-2">
                {trend === 'improving' && <span className="text-green-600">📈 Your mood has been improving</span>}
                {trend === 'declining' && <span className="text-orange-600">📉 Your mood has been declining</span>}
                {trend === 'stable' && <span className="text-blue-600">➡️ Your mood has been stable</span>}
              </div>
            </Card>

            {/* Mood Distribution Chart */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Mood Distribution (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getMoodChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="mood" 
                    tickFormatter={(value) => getMoodEmoji(value)}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} times`, 'Frequency']}
                    labelFormatter={(label) => `${getMoodEmoji(label)} ${label.replace('-', ' ')}`}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Recent Entries */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Recent Mood Entries</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {moodEntries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className="font-medium capitalize">{entry.mood.replace('-', ' ')}</p>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{moodEntries.length}</p>
                  <p className="text-sm text-muted-foreground">Total Check-ins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round((moodEntries.length / 30) * 100) / 100}
                  </p>
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}