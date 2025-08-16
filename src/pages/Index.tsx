import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { WelcomeCard } from "@/components/WelcomeCard";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { QuickCalmTools } from "@/components/QuickCalmTools";
import { JournalPrompt } from "@/components/JournalPrompt";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { UpgradeCard } from "@/components/UpgradeCard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <WelcomeCard userName="Sheila" />
            <MoodCheckIn />
            <QuickCalmTools />
            <JournalPrompt />
            <DailyAffirmation />
            <UpgradeCard />
          </div>
        );
      case "journal":
        return (
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Journal</h1>
            <p className="text-muted-foreground">Your thoughts and reflections</p>
          </div>
        );
      case "insights":
        return (
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Insights</h1>
            <p className="text-muted-foreground">Your mood patterns and progress</p>
          </div>
        );
      case "circles":
        return (
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Circles</h1>
            <p className="text-muted-foreground">Connect with your support community</p>
          </div>
        );
      case "you":
        return (
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-foreground mb-4">You</h1>
            <p className="text-muted-foreground">Your profile and personalization</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
        {renderContent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
