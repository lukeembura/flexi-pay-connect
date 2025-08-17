import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Use at least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Add numbers');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Add special characters (!@#$%^&*)');
  }

  // Very long password bonus
  if (password.length >= 12) {
    score += 1;
  }

  let label = '';
  let color = '';

  if (score <= 2) {
    label = 'Weak';
    color = 'bg-destructive';
  } else if (score <= 3) {
    label = 'Fair';
    color = 'bg-yellow-500';
  } else if (score <= 4) {
    label = 'Good';
    color = 'bg-blue-500';
  } else {
    label = 'Strong';
    color = 'bg-green-500';
  }

  return { score, label, color, suggestions };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const progressPercentage = (strength.score / 5) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={cn(
          "text-sm font-medium",
          strength.score <= 2 && "text-destructive",
          strength.score === 3 && "text-yellow-600",
          strength.score === 4 && "text-blue-600",
          strength.score >= 5 && "text-green-600"
        )}>
          {strength.label}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-300", strength.color)}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {strength.suggestions.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>To improve your password:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            {strength.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};