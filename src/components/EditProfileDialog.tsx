import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useApp } from '../lib/context';
import { toast } from 'sonner@2.0.3';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [weeklyGoal, setWeeklyGoal] = useState(user?.weeklyGoal.toString() || '4');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setWeeklyGoal(user.weeklyGoal.toString());
    }
  }, [user, open]);

  const handleSave = () => {
    if (!user || !name || !email) return;

    updateUser({
      ...user,
      name,
      email,
      weeklyGoal: parseInt(weeklyGoal) || 4
    });

    toast.success('Profile updated successfully');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md wireframe-dialog">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide font-mono">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase tracking-wide">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="wireframe-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase tracking-wide">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="wireframe-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="uppercase tracking-wide">Weekly Workout Goal</Label>
            <Input
              id="goal"
              type="number"
              min="1"
              max="7"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(e.target.value)}
              className="wireframe-input"
            />
            <p className="text-xs text-muted-foreground font-mono">
              Number of workouts you want to complete each week
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 wireframe-button"
              data-variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name || !email}
              className="flex-1 wireframe-button"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
