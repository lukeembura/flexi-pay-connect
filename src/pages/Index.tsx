import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { WelcomeCard } from "@/components/WelcomeCard";
import { MoodCheckInModal } from "@/components/MoodCheckInModal";
import { QuickCalmTools } from "@/components/QuickCalmTools";
import { JournalPrompt } from "@/components/JournalPrompt";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { UpgradeCard } from "@/components/UpgradeCard";
import { YouPage } from "@/components/YouPage";
import { JournalPage } from "@/components/JournalPage";
import { InsightsPage } from "@/components/InsightsPage";
import { CirclesPage } from "@/components/CirclesPage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to SereniYou</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to continue your wellness journey.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <WelcomeCard userName={user.user_metadata?.display_name || user.email?.split('@')[0] || "User"} />
            <MoodCheckInModal />
            <QuickCalmTools />
            <JournalPrompt />
            <DailyAffirmation />
            <UpgradeCard />
          </div>
        );
      case "journal":
        return <JournalPage />;
      case "insights":
        return <InsightsPage />;
      case "circles":
        return <CirclesPage />;
      case "you":
        return <YouPage />;
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
