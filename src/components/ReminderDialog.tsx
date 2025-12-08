import { useEffect, useState } from "react";
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
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface ReminderScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  currentTime: string; // "HH:MM"
  onSave: (newTime: string) => void;
}

function isValidTime(value: string) {
  
  return /^\d{2}:\d{2}$/.test(value);
}

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

  const handleClose = () => {
    onClose();
  };

  const handleSaveClick = () => {
    if (!isValidTime(time)) {
      toast.error("Please enter a valid time (HH:MM)");
      return;
    }
    onSave(time);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md bg-white rounded-none border-[6px] border-black wireframe-dialog">
        
        <div className="px-8 py-8 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="uppercase tracking-wide font-mono text-xl">
              Workout Reminder
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-muted-foreground">
              Choose what time you’d like to get your daily workout reminder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label
              htmlFor="reminder-time"
              className="uppercase tracking-wide text-xs font-mono flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Reminder time
            </Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="wireframe-input"
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              Uses your device’s local time. Example: 18:00 = 6:00 PM.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 wireframe-button"
              data-variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveClick}
              className="flex-1 wireframe-button"
            >
              Save time
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
