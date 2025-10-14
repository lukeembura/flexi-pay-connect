import { Leaf } from "lucide-react";

interface WelcomeCardProps {
  userName?: string;
}

export function WelcomeCard({ userName = "Sheila" }: WelcomeCardProps) {
  return (
    <div className="bg-gradient-peaceful p-6 rounded-2xl shadow-gentle animate-fade-in-up">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {userName}
        </h1>
        <Leaf className="text-primary animate-float" size={24} />
      </div>
      <p className="text-muted-foreground">
        Let's create space for your peace today.
      </p>
    </div>
  );
}