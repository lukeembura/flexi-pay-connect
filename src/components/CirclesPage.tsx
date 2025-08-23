import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, Heart, Plus, Sparkles, Shield, Loader2, Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  time: string;
  likes: number;
  replies: number;
  circle: string;
  mood?: string;
  isLiked?: boolean;
}

interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  isJoined: boolean;
  color: string;
  icon: string;
  category: string;
  rules?: string[];
}

export function CirclesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCircle, setNewCircle] = useState({
    name: "",
    description: "",
    category: "mindfulness",
    icon: "🧘"
  });

  const categories = [
    { value: "all", label: "All", icon: "🌟" },
    { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
    { value: "growth", label: "Growth", icon: "🌱" },
    { value: "gratitude", label: "Gratitude", icon: "🙏" },
    { value: "support", label: "Support", icon: "💙" },
    { value: "creativity", label: "Creativity", icon: "🎨" }
  ];

  const circles: Circle[] = [
    {
      id: "1",
      name: "Mindful Moments",
      description: "Share daily mindfulness practices and peaceful reflections",
      members: 1247,
      isJoined: true,
      color: "bg-green-500",
      icon: "🧘",
      category: "mindfulness",
      rules: ["Be kind and respectful", "Share from the heart", "No judgment"]
    },
    {
      id: "2", 
      name: "Growth & Healing",
      description: "Supporting each other through life's challenges and growth",
      members: 892,
      isJoined: true,
      color: "bg-purple-500",
      icon: "🌱",
      category: "growth",
      rules: ["Supportive environment", "Share experiences", "Maintain confidentiality"]
    },
    {
      id: "3",
      name: "Gratitude Circle",
      description: "Daily gratitude sharing and positive energy",
      members: 2156,
      isJoined: false,
      color: "bg-orange-500",
      icon: "🙏",
      category: "gratitude",
      rules: ["Focus on gratitude", "Spread positivity", "Encourage others"]
    },
    {
      id: "4",
      name: "Night Owls",
      description: "Late night thoughts and gentle conversations",
      members: 543,
      isJoined: false,
      color: "bg-indigo-500",
      icon: "🌙",
      category: "support",
      rules: ["Respect quiet hours", "Gentle conversations", "Support night owls"]
    },
    {
      id: "5",
      name: "Creative Souls",
      description: "Express your creativity through art, writing, and imagination",
      members: 756,
      isJoined: false,
      color: "bg-pink-500",
      icon: "🎨",
      category: "creativity",
      rules: ["Share your creativity", "Encourage others", "Respect all art forms"]
    },
    {
      id: "6",
      name: "Wellness Warriors",
      description: "Supporting each other in physical and mental wellness journeys",
      members: 1103,
      isJoined: false,
      color: "bg-teal-500",
      icon: "💪",
      category: "growth",
      rules: ["Share wellness tips", "Celebrate progress", "Support challenges"]
    }
  ];

  const posts: Post[] = [
    {
      id: "1",
      author: {
        name: "Sarah M.",
        avatar: "",
        isVerified: true
      },
      content: "Just finished a 10-minute meditation and feeling so much more centered. It's amazing how taking just a few moments to breathe can shift your entire perspective. What small practice helped you find peace today?",
      time: "2 hours ago",
      likes: 24,
      replies: 8,
      circle: "Mindful Moments",
      mood: "Peaceful",
      isLiked: false
    },
    {
      id: "2",
      author: {
        name: "Alex R.",
        avatar: ""
      },
      content: "Going through a tough time right now, but reading everyone's stories here reminds me that I'm not alone. Thank you all for being such a supportive community. Your words mean more than you know. 💙",
      time: "4 hours ago",
      likes: 67,
      replies: 15,
      circle: "Growth & Healing",
      mood: "Grateful",
      isLiked: true
    },
    {
      id: "3",
      author: {
        name: "Maya L.",
        avatar: ""
      },
      content: "Three things I'm grateful for today: morning coffee, a phone call with my sister, and the way the sunset painted the sky orange. Sometimes it's the simple things that fill our hearts the most. ☀️",
      time: "6 hours ago",
      likes: 42,
      replies: 12,
      circle: "Gratitude Circle",
      mood: "Grateful",
      isLiked: false
    }
  ];

  const [currentPosts, setCurrentPosts] = useState<Post[]>(posts);
  const [currentCircles, setCurrentCircles] = useState<Circle[]>(circles);

  const handleLikePost = (postId: string) => {
    setCurrentPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleJoinCircle = (circleId: string) => {
    setCurrentCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { ...circle, isJoined: !circle.isJoined, members: circle.isJoined ? circle.members - 1 : circle.members + 1 }
        : circle
    ));
    
    const circle = currentCircles.find(c => c.id === circleId);
    if (circle) {
      toast({
        title: circle.isJoined ? "Left Circle" : "Joined Circle",
        description: circle.isJoined 
          ? `You've left ${circle.name}` 
          : `Welcome to ${circle.name}!`,
      });
    }
  };

  const handleCreateCircle = async () => {
    if (!newCircle.name || !newCircle.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCircleData: Circle = {
        id: Date.now().toString(),
        name: newCircle.name,
        description: newCircle.description,
        members: 1,
        isJoined: true,
        color: "bg-blue-500",
        icon: newCircle.icon,
        category: newCircle.category,
        rules: ["Be kind and respectful", "Share from the heart"]
      };

      setCurrentCircles(prev => [newCircleData, ...prev]);
      setNewCircle({ name: "", description: "", category: "mindfulness", icon: "🧘" });
      setShowCreateDialog(false);
      
      toast({
        title: "Circle Created! 🎉",
        description: `${newCircle.name} is now live and ready for members`,
      });
      setLoading(false);
    }, 1000);
  };

  const filteredCircles = currentCircles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || circle.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const FeedContent = () => (
    <div className="space-y-4">
      {currentPosts.map((post) => (
        <Card key={post.id} className="p-4 hover:shadow-gentle transition-all duration-300">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{post.author.name}</span>
                {post.author.isVerified && (
                  <Shield className="h-4 w-4 text-primary" />
                )}
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.circle}
                </Badge>
                {post.mood && (
                  <Badge variant="secondary" className="text-xs">
                    {post.mood}
                  </Badge>
                )}
              </div>
              
              <p className="text-foreground text-sm leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex items-center gap-6 pt-2">
                <button 
                  className={`flex items-center gap-2 transition-colors ${
                    post.isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                  onClick={() => handleLikePost(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.replies}</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const CirclesContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Discover Circles</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Circle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create a New Circle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Circle Name</label>
                <Input
                  placeholder="Enter circle name"
                  value={newCircle.name}
                  onChange={(e) => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what this circle is about"
                  value={newCircle.description}
                  onChange={(e) => setNewCircle(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newCircle.category}
                  onChange={(e) => setNewCircle(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <div className="flex gap-2">
                  {['🧘', '🌱', '🙏', '🌙', '🎨', '💪', '🌟', '💙'].map(icon => (
                    <button
                      key={icon}
                      className={`p-2 rounded-md border-2 ${
                        newCircle.icon === icon ? 'border-primary' : 'border-muted'
                      }`}
                      onClick={() => setNewCircle(prev => ({ ...prev, icon }))}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCircle}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Circle'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search circles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {filteredCircles.map((circle) => (
        <Card key={circle.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${circle.color} rounded-xl flex items-center justify-center text-white text-xl`}>
              {circle.icon}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{circle.name}</h4>
                <Button 
                  size="sm" 
                  variant={circle.isJoined ? "secondary" : "default"}
                  onClick={() => handleJoinCircle(circle.id)}
                >
                  {circle.isJoined ? "Joined" : "Join"}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {circle.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {circle.members.toLocaleString()} members
                </div>
                <Badge variant="outline" className="text-xs">
                  {categories.find(c => c.value === circle.category)?.label}
                </Badge>
              </div>

              {circle.isJoined && circle.rules && (
                <div className="pt-2 border-t border-muted">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Circle Rules:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {circle.rules.map((rule, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      {filteredCircles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No circles found matching your criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Circles
        </h1>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Community
        </Badge>
      </div>

      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Welcome to Circles</h3>
            <p className="text-sm text-muted-foreground">
              Connect with others who understand your journey
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">My Feed</TabsTrigger>
          <TabsTrigger value="circles">All Circles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="mt-6">
          <FeedContent />
        </TabsContent>
        
        <TabsContent value="circles" className="mt-6">
          <CirclesContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}