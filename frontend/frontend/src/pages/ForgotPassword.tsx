import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordReset(email);
      setSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to send reset email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="p-4 text-center">
              Check your email for a password reset link.
              <div className="mt-4">
                <Button variant="link" onClick={() => navigate('/auth')}>Back to Sign In</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Send Reset Link</Button>
              <div className="flex justify-center">
                <Button variant="link" type="button" onClick={() => navigate('/auth')}>
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;