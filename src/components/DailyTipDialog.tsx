import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Lightbulb, Zap, Target, Trophy } from "lucide-react";

interface DailyTipDialogProps {
  open: boolean;
  onClose: () => void;
}

const tips = [
  {
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    title: "Today's Motivation",
    message: "Every rep counts! Focus on form over speed for better results."
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-500" />,
    title: "Energy Boost",
    message: "Remember to hydrate! Drink water before, during, and after your workout."
  },
  {
    icon: <Target className="w-8 h-8 text-green-500" />,
    title: "Focus Point",
    message: "Progressive overload is key - gradually increase weight, reps, or time."
  },
  {
    icon: <Trophy className="w-8 h-8 text-purple-500" />,
    title: "Champion Mindset",
    message: "Consistency beats perfection. Show up even when you don't feel like it!"
  }
];

export function DailyTipDialog({ open, onClose }: DailyTipDialogProps) {
  // Get today's tip based on the day of the year
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todaysTip = tips[dayOfYear % tips.length];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md wireframe-dialog">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {todaysTip.icon}
          </div>
          <DialogTitle className="text-xl uppercase tracking-wide font-mono">{todaysTip.title}</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-6">
          <p className="text-muted-foreground font-mono">{todaysTip.message}</p>
          <Button onClick={onClose} className="w-full wireframe-button">
            Let's Get Started!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}