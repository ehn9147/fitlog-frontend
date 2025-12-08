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
import { useApp } from "../lib/context";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [weeklyGoal, setWeeklyGoal] = useState(
    user?.weeklyGoal?.toString() || "4"
  );

  useEffect(() => {
    if (user && open) {
      setName(user.name);
      setEmail(user.email);
      setWeeklyGoal(user.weeklyGoal?.toString() || "4");
    }
  }, [user, open]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!user) return;

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in name and email");
      return;
    }

    const parsedGoal = parseInt(weeklyGoal, 10);
    const safeGoal = Number.isNaN(parsedGoal) ? 4 : parsedGoal;

    updateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      weeklyGoal: safeGoal,
    });

    toast.success("Profile updated");
    handleClose();
  };

  const isValid = name.trim() !== "" && email.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-white rounded-none border-[6px] border-black wireframe-dialog">
        {/* Inner padding wrapper */}
        <div className="px-8 py-8 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="uppercase tracking-wide font-mono text-xl">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-muted-foreground">
              Update your account info and weekly workout goal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="profile-name"
                  className="uppercase tracking-wide text-xs font-mono"
                >
                  Name
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="wireframe-input"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="profile-email"
                  className="uppercase tracking-wide text-xs font-mono"
                >
                  Email
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="wireframe-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Weekly goal */}
            <div className="space-y-2">
              <Label
                htmlFor="profile-weekly-goal"
                className="uppercase tracking-wide text-xs font-mono"
              >
                Weekly workout goal
              </Label>
              <Input
                id="profile-weekly-goal"
                type="number"
                min={1}
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(e.target.value)}
                className="wireframe-input"
              />
              <p className="text-[11px] text-muted-foreground font-mono">
                How many workouts you aim for each week.
              </p>
            </div>
          </div>

          {/* Buttons */}
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
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1 wireframe-button"
            >
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
