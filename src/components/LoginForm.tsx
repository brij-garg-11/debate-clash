
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebate } from "@/contexts/DebateContext";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const { login } = useDebate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }
    login(username);
    toast({
      title: "Welcome to Debate Arena Clash!",
      description: "You are now logged in. Choose a topic to start debating.",
    });
  };

  return (
    <div className="debate-card w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Join Debates</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Choose your debater name
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="debate-input"
            placeholder="e.g., LogicalThinker123"
            required
          />
        </div>
        <Button
          type="submit"
          className="debate-button w-full"
          disabled={username.trim().length < 3}
        >
          Enter the Arena
        </Button>
      </form>
    </div>
  );
};
