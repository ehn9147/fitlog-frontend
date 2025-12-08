import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
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
import { Calendar, Clock, Dumbbell } from "lucide-react";

interface StartWorkoutDialogProps {
  open: boolean;
  onClose: () => void;
}

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

  const longDate = (() => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-white rounded-none border-[6px] border-black wireframe-dialog">
        
        <div className="px-8 py-8 space-y-6">
          {/* HEADER */}
          <DialogHeader className="space-y-2">
            <DialogTitle className="uppercase tracking-wide font-mono text-xl">
              Start New Workout
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-muted-foreground">
              Get a quick suggested plan without logging a workout.
            </DialogDescription>
          </DialogHeader>

          {/* TYPE + DATE ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="uppercase tracking-wide text-xs font-mono">
                Type
              </Label>
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

            <div className="space-y-2">
              <Label className="uppercase tracking-wide text-xs font-mono">
                Date
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="wireframe-input"
              />
              <p className="text-[11px] text-muted-foreground font-mono">
                {longDate}
              </p>
            </div>
          </div>

          {/* SUGGESTED PLAN CARD */}
          <Card className="wireframe-card">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span className="uppercase tracking-wide text-xs font-mono">
                    Suggested Plan
                  </span>
                </div>
                <span className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  ~{suggestion.duration} min
                </span>
              </div>

              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                {suggestion.text}
              </p>
            </CardContent>
          </Card>

          {/* FOOTER BUTTON + NOTE */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full wireframe-button"
              data-variant="outline"
            >
              Close
            </Button>

            <p className="text-[11px] text-muted-foreground font-mono text-center">
              This quick start does <span className="font-semibold">not</span>{" "}
              log a workout or update your progress.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
