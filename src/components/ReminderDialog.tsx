import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type ReminderScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  currentTime: string;          // "18:00"
  onSave: (time: string) => void; // "HH:MM" 24h
};

const PRESET_TIMES = [
  { label: "6:00 AM", value: "06:00" },
  { label: "7:00 AM", value: "07:00" },
  { label: "8:00 AM", value: "08:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "6:00 PM", value: "18:00" },
  { label: "8:00 PM", value: "20:00" },
];

export function ReminderScheduleDialog({
  open,
  onClose,
  currentTime,
  onSave,
}: ReminderScheduleDialogProps) {
  const [time, setTime] = useState(currentTime || "18:00");

  useEffect(() => {
    if (open) {
      setTime(currentTime || "18:00");
    }
  }, [open, currentTime]);

  const handleSave = () => {
    if (!time) return;
    onSave(time);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md wireframe-card">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide font-mono">
            Workout Reminder
          </DialogTitle>
          <DialogDescription className="font-mono">
            Choose what time you want FitLog to remind you to work out each day.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Quick presets */}
          <div className="space-y-2">
            <Label className="uppercase tracking-wide text-xs font-mono">
              Quick times
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_TIMES.map((t) => (
                <Button
                  key={t.value}
                  type="button"
                  variant={time === t.value ? "default" : "outline"}
                  className="wireframe-button font-mono text-xs"
                  data-variant={time === t.value ? "default" : "outline"}
                  onClick={() => setTime(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="wireframe-separator" />

          {/* Exact time input */}
          <div className="space-y-2">
            <Label className="uppercase tracking-wide text-xs font-mono">
              Custom time
            </Label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="wireframe-input w-full border rounded-md px-3 py-2 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground font-mono">
              Daily reminder will be sent at this time.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            className="wireframe-button"
            data-variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="wireframe-button"
            onClick={handleSave}
          >
            Save reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
