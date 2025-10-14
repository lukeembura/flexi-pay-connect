import { Card } from "@/components/ui/card";

interface JournalPromptProps {
  onNavigateToJournal: () => void;
}

export function JournalPrompt({ onNavigateToJournal }: JournalPromptProps) {
  return (
    <Card className="p-4 bg-accent/20 border-accent/30 hover:shadow-gentle transition-all duration-300 cursor-pointer group rounded-2xl" onClick={onNavigateToJournal}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✍️</div>
          <div>
            <h3 className="font-medium text-foreground">Journal Prompt</h3>
            <p className="text-muted-foreground text-sm italic">
              "What did your soul need today?"
            </p>
          </div>
        </div>
        <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1">
          →
        </div>
      </div>
    </Card>
  );
}