import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, Dumbbell, Edit, Trash2 } from 'lucide-react';
import { Workout } from '../types';
import { useApp } from '../lib/context';
import { useState } from 'react';
import { WorkoutDialog } from './WorkoutDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface WorkoutDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  workout: Workout | null;
}

export function WorkoutDetailsDialog({ open, onClose, workout }: WorkoutDetailsDialogProps) {
  const { deleteWorkout } = useApp();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!workout) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    deleteWorkout(workout.id);
    setShowDeleteDialog(false);
    onClose();
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  return (
    <>
      <Dialog open={open && !showEdit} onOpenChange={onClose}>
        {/* Unified shell like other dialogs */}
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-none border-[6px] border-black py-8">
          {/* Inner horizontal padding so content doesn’t touch sides */}
          <div className="px-10">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl uppercase tracking-wide font-mono">
                    {workout.name}
                  </DialogTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(workout.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {workout.duration} min
                    </span>
                  </div>
                </div>
                <Badge className="wireframe-badge">
                  {workout.type}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <h3 className="uppercase tracking-wide mb-3">Exercises</h3>
                <div className="space-y-2">
                  {workout.exercises.map((exercise) => (
                    <Card key={exercise.id} className="wireframe-card">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {/* icon container – no extra wireframe border */}
                            <div className="p-2 bg-muted rounded">
                              <Dumbbell className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium uppercase tracking-wide">
                                {exercise.name}
                              </div>
                              <div className="text-sm text-muted-foreground font-mono mt-1">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight && exercise.weight > 0 && ` • ${exercise.weight} lbs`}
                              </div>
                              {exercise.notes && (
                                <p className="text-sm text-muted-foreground mt-1 font-mono">
                                  {exercise.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {workout.notes && (
                <div>
                  <h3 className="uppercase tracking-wide mb-2">Notes</h3>
                  <Card className="wireframe-card">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground font-mono">
                        {workout.notes}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex-1 wireframe-button"
                  data-variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Workout
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="wireframe-button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WorkoutDialog
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          onClose();
        }}
        workout={workout}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        {/* Match delete dialog shell too */}
        <AlertDialogContent className="sm:max-w-md bg-white rounded-none border-[6px] border-black py-8">
          <div className="px-10">
            <AlertDialogHeader>
              <AlertDialogTitle className="uppercase tracking-wide font-mono">
                Delete Workout?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-mono">
                This action cannot be undone. This will permanently delete your workout data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="wireframe-button" data-variant="outline">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="wireframe-button bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
