import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";

interface StartWorkoutDialogProps {
  open: boolean;
  onClose: () => void;
}

// suggestion helper
function getSuggestion(type: string) {
  switch (type) {
    case "Strength":
      return {
        duration: 45,
        text: "4–5 compound lifts • 3 sets of 8–10 reps (Squat, Bench, Row, OHP).",
      };
    case "Cardio":
      return {
        duration: 30,
        text: "5 min warm-up • 20 min jog or cycle • 5 min cool-down.",
      };
    case "Flexibility":
      return {
        duration: 20,
        text: "8–10 stretches • Hold 30–45 seconds • Focus on hips, hamstrings, shoulders.",
      };
    default:
      return {
        duration: 40,
        text: "10 min warm-up • 20 min bodyweight/core • 10 min mobility.",
      };
  }
}

export function StartWorkoutDialog({ open, onClose }: StartWorkoutDialogProps) {
  const [type, setType] = useState<string>("Strength");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const suggestion = getSuggestion(type);

  useEffect(() => {
    if (!open) {
      setType("Strength");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [open]);

  const handleClose = () => onClose();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* Outer shell: border + vertical padding */}
      <DialogContent className="sm:max-w-lg bg-white rounded-none border-[6px] border-black py-8">
        {/* Inner wrapper: EXTRA left/right padding so content never touches edges */}
        <div className="px-10">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wide font-mono">
              Start New Workout
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Type */}
            <div className="space-y-2">
              <Label className="uppercase tracking-wide">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="wireframe-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="uppercase tracking-wide">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="wireframe-input"
              />
            </div>

            {/* Suggested Plan */}
            <Card className="wireframe-card">
              <CardContent className="pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wide text-sm font-mono">
                    Suggested Plan
                  </span>
                  <span className="font-mono text-sm">
                    ~{suggestion.duration} min
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {suggestion.text}
                </p>
              </CardContent>
            </Card>

            {/* Close button */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 wireframe-button"
                data-variant="outline"
              >
                Close
              </Button>
            </div>

            <p className="text-xs text-muted-foreground font-mono text-center">
              This quick start does <span className="font-semibold">not</span>{" "}
              log a workout or update your progress.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
