import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, BookOpen } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
}

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "A Peaceful Morning",
      content: "Today I woke up feeling grateful for the simple things. The sun was shining through my window, and I could hear birds singing. It reminded me to slow down and appreciate the present moment.",
      mood: "Grateful",
      date: "2024-01-16",
      tags: ["gratitude", "morning", "mindfulness"]
    },
    {
      id: "2", 
      title: "Reflection on Growth",
      content: "I've been thinking about how much I've changed this year. The challenges I faced seemed overwhelming at the time, but looking back, they've made me stronger and more resilient.",
      mood: "Reflective",
      date: "2024-01-15",
      tags: ["growth", "reflection", "resilience"]
    }
  ]);
  
  const [isWriting, setIsWriting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "",
    tags: ""
  });

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood || "Neutral",
        date: new Date().toISOString().split('T')[0],
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: "", content: "", mood: "", tags: "" });
      setIsWriting(false);
    }
  };

  if (isWriting) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            New Journal Entry
          </h1>
          <Button variant="outline" onClick={() => setIsWriting(false)}>
            Cancel
          </Button>
        </div>

        <Card className="p-6 space-y-4">
          <Input
            placeholder="Entry title..."
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            className="text-lg font-medium"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="How are you feeling?"
              value={newEntry.mood}
              onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
            />
            <Input
              placeholder="Tags (comma separated)"
              value={newEntry.tags}
              onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
            />
          </div>

          <Textarea
            placeholder="What's on your mind today? Write about your thoughts, feelings, experiences..."
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            className="min-h-[200px] resize-none"
          />

          <div className="flex gap-2">
            <Button onClick={handleSaveEntry} className="flex-1">
              Save Entry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Journal
        </h1>
        <Button onClick={() => setIsWriting(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Write
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? "No entries found" : "Start your journal journey"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try different search terms" : "Capture your thoughts, feelings, and experiences"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsWriting(true)}>
                Write your first entry
              </Button>
            )}
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="p-4 hover:shadow-gentle transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-foreground text-lg">{entry.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                {entry.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {entry.mood}
                  </Badge>
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm">
                  Read more
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}