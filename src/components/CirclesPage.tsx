import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, Heart, Plus, Sparkles, Shield } from "lucide-react";

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
}

interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  isJoined: boolean;
  color: string;
  icon: string;
}

export function CirclesPage() {
  const [activeTab, setActiveTab] = useState("feed");

  const circles: Circle[] = [
    {
      id: "1",
      name: "Mindful Moments",
      description: "Share daily mindfulness practices and peaceful reflections",
      members: 1247,
      isJoined: true,
      color: "bg-green-500",
      icon: "🧘"
    },
    {
      id: "2", 
      name: "Growth & Healing",
      description: "Supporting each other through life's challenges and growth",
      members: 892,
      isJoined: true,
      color: "bg-purple-500",
      icon: "🌱"
    },
    {
      id: "3",
      name: "Gratitude Circle",
      description: "Daily gratitude sharing and positive energy",
      members: 2156,
      isJoined: false,
      color: "bg-orange-500",
      icon: "🙏"
    },
    {
      id: "4",
      name: "Night Owls",
      description: "Late night thoughts and gentle conversations",
      members: 543,
      isJoined: false,
      color: "bg-indigo-500",
      icon: "🌙"
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
      mood: "Peaceful"
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
      mood: "Grateful"
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
      mood: "Grateful"
    }
  ];

  const FeedContent = () => (
    <div className="space-y-4">
      {posts.map((post) => (
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
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="h-4 w-4" />
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
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Circle
        </Button>
      </div>
      
      {circles.map((circle) => (
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
                >
                  {circle.isJoined ? "Joined" : "Join"}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {circle.description}
              </p>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {circle.members.toLocaleString()} members
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
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