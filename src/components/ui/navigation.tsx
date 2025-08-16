import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "home", icon: "🌿", label: "Home" },
  { id: "journal", icon: "📝", label: "Journal" },
  { id: "insights", icon: "📊", label: "Insights" },
  { id: "circles", icon: "💬", label: "Circles" },
  { id: "you", icon: "⚙️", label: "You" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around py-3 px-4">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300",
                "hover:bg-muted/50 active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "text-lg transition-all duration-300",
                isActive && "animate-gentle-pulse"
              )}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}