import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { DailyTipDialog } from "./DailyTipDialog";
import { Dumbbell } from "lucide-react";
import { useApp } from "../lib/context";
import { getUserByEmail, saveUser } from "../lib/storage";
import { User } from "../types";

export function LoginScreen() {
  const { login } = useApp();
  const [showTip, setShowTip] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;

    if (isSignUp) {
      // Create new user
      if (!name) return;
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        weeklyGoal: 4,
        createdAt: new Date().toISOString()
      };
      
      saveUser(newUser);
      login(newUser);
    } else {
      // Login existing user or create demo user
      let user = getUserByEmail(email);
      
      if (!user) {
        // Create demo user if doesn't exist
        user = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          weeklyGoal: 4,
          createdAt: new Date().toISOString()
        };
        saveUser(user);
      }
      
      login(user);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md wireframe-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Dumbbell className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl uppercase tracking-wider font-mono">FitLog</CardTitle>
          <CardDescription className="font-mono">
            Track your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="uppercase tracking-wide">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="wireframe-input"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase tracking-wide">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="wireframe-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="uppercase tracking-wide">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="wireframe-input"
            />
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full wireframe-button"
            disabled={!email || !password || (isSignUp && !name)}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <div className="text-center">
            <Button 
              variant="link" 
              className="text-sm"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setName("");
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DailyTipDialog 
        open={showTip} 
        onClose={() => setShowTip(false)} 
      />
    </div>
  );
}