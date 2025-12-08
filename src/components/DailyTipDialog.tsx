import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Lightbulb } from "lucide-react";

interface DailyTipDialogProps {
  open: boolean;
  onClose: () => void;
}

const DAILY_TIPS: string[] = [
  "Done is better than perfect. A short workout you actually do beats the perfect one you skip.",
  "Schedule your workouts like appointments. If it’s on the calendar, it’s real.",
  "Start your workout with the exercise you dread the most. Get the hardest thing done first.",
  "Progress over perfection: add 1 more rep, 1 more set, or 1 more minute this week.",
  "You don’t need motivation, you need a routine. Show up first—motivation usually follows.",
  "Track something simple: workouts per week. Hitting that number matters more than any single session.",
  "Bad workout? Good. You just proved you can still show up on a bad day.",
  "Keep your warm-up non-negotiable. It’s the bridge between ‘I don’t feel like it’ and ‘I’m in it’.",
  "Sleep and hydration are secret performance boosts. Protect both if you want better workouts.",
  "If you miss a day, don’t miss two. The second miss is where habits really break.",
  "Pair your workout with a ‘treat’—podcast, music, or show you only enjoy while training.",
  "Write tomorrow’s workout at the end of today’s session. Future you will thank you.",
  "Small wins stack: 10 minutes now is better than waiting for the perfect 60-minute block.",
  "Strength comes from consistency, not intensity. Be the person who keeps showing up.",
  "Your only real competition is yesterday’s you. Aim to be 1% better, not perfect."
];

export function DailyTipDialog({ open, onClose }: DailyTipDialogProps) {
  const [tip, setTip] = useState<string>("");

  // Pick a random tip each time the dialog opens
  useEffect(() => {
    if (open && DAILY_TIPS.length > 0) {
      const index = Math.floor(Math.random() * DAILY_TIPS.length);
      setTip(DAILY_TIPS[index]);
    }
  }, [open]);

  const handleClose = () => onClose();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md bg-white rounded-none border-[6px] border-black wireframe-dialog">
        {/* Inner padding wrapper */}
        <div className="px-8 py-8 space-y-6">
          {/* HEADER */}
          <DialogHeader className="space-y-2">
            <DialogTitle className="uppercase tracking-wide font-mono text-xl">
              Daily Tip
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-muted-foreground">
              A quick bit of motivation or advice to keep you consistent.
            </DialogDescription>
          </DialogHeader>

          {/* TIP CARD */}
          <Card className="wireframe-card">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span className="uppercase tracking-wide text-xs font-mono">
                  Today&apos;s Daily Tip
                </span>
              </div>

              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                {tip || "Loading your tip for today..."}
              </p>
            </CardContent>
          </Card>

          {/* BUTTON */}
          <div className="flex justify-start pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="wireframe-button"
              data-variant="outline"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
