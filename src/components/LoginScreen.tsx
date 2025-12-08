import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DailyTipDialog } from "./DailyTipDialog";
import { Dumbbell } from "lucide-react";
import { useApp } from "../lib/context";
import { getUserByEmail, saveUser as saveUserToStorage } from "../lib/storage";
import { User } from "../types";
import { toast } from "sonner";

export function LoginScreen() {
  const { login } = useApp();
  const [showTip, setShowTip] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");

  const isValidEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.toLowerCase());
  };

  const isValidName = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length >= 2 && /^[A-Za-z ]+$/.test(trimmed);
  };

  const isStrongPassword = (value: string) => {
    if (value.length < 8) return false;
    const hasLetter = /[A-Za-z]/.test(value);
    const hasDigit = /\d/.test(value);
    return hasLetter && hasDigit;
  };

  const handleSubmit = () => {
    if (!email || !password || (isSignUp && !name)) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // normalize email so user.id is stable
    const normalizedEmail = email.trim().toLowerCase();

    if (isSignUp) {
      if (!isValidName(name)) {
        toast.error(
          "Name should be at least 2 letters and contain only letters and spaces."
        );
        return;
      }

      if (!isStrongPassword(password)) {
        toast.error(
          "Password must be at least 8 characters and include a letter and a number."
        );
        return;
      }

      const existing = getUserByEmail(normalizedEmail);
      if (existing) {
        toast.error("An account with this email already exists. Please sign in.");
        return;
      }

      // ✅ use normalizedEmail as a STABLE id
      const newUser: User = {
        id: normalizedEmail,
        name: name.trim(),
        email: normalizedEmail,
        weeklyGoal: 4,
        createdAt: new Date().toISOString(),
      };

      saveUserToStorage(newUser);
      login(newUser);
      toast.success("Account created successfully. Welcome to FitLog!");
    } else {
      const existing = getUserByEmail(normalizedEmail);

      if (!existing) {
        toast.error("No account found with that email. Please sign up first.");
        return;
      }

      // In a real app, you'd verify password here.
      login(existing);
      toast.success("Signed in successfully.");
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
          <CardTitle className="text-2xl uppercase tracking-wider font-mono">
            FitLog
          </CardTitle>
          <CardDescription className="font-mono">
            {isSignUp
              ? "Create a secure account to track your workouts."
              : "Sign in to continue your fitness journey."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="uppercase tracking-wide">
                Name
              </Label>
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
            <Label htmlFor="email" className="uppercase tracking-wide">
              Email
            </Label>
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
            <Label htmlFor="password" className="uppercase tracking-wide">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="wireframe-input"
            />
            {isSignUp && (
              <p className="text-xs text-muted-foreground font-mono">
                At least 8 characters, including a letter and a number.
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full wireframe-button"
            disabled={!email || !password || (isSignUp && !name)}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setName("");
                setPassword("");
              }}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DailyTipDialog open={showTip} onClose={() => setShowTip(false)} />
    </div>
  );
}
