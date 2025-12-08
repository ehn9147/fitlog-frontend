import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, Clock, Dumbbell, Trash2, Pencil } from "lucide-react";
import { Workout } from "../types";
import { WorkoutDialog } from "./WorkoutDialog";
import { useApp } from "../lib/context";
import { toast } from "sonner";

interface WorkoutDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  workout: Workout | null;
}

function formatLongDate(dateString: string | undefined) {
  if (!dateString) return "";
  const normalized = dateString.includes("T")
    ? dateString
    : `${dateString}T00:00:00`;

  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return dateString;

  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function WorkoutDetailsDialog({
  open,
  onClose,
  workout,
}: WorkoutDetailsDialogProps) {
  const { deleteWorkout, workouts } = useApp();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

 
  const resolvedWorkout =
    workout && workouts
      ? workouts.find((w) => w.id === workout.id) ?? workout
      : workout;

  const handleClose = () => {
    onClose();
  };

  if (!resolvedWorkout) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-md bg-white rounded-none border-[6px] border-black wireframe-dialog">
          <div className="px-8 py-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-wide font-mono">
                Workout Details
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-muted-foreground">
                No workout selected.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button
                variant="outline"
                data-variant="outline"
                className="wireframe-button"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalSets = resolvedWorkout.exercises.reduce(
    (sum, ex) => sum + (ex.sets || 0),
    0
  );
  const totalExercises = resolvedWorkout.exercises.length;
  const longDate = formatLongDate(resolvedWorkout.date);

  const actuallyDelete = () => {
    if (!resolvedWorkout.id) return;
    deleteWorkout(resolvedWorkout.id);
    toast.success("Workout deleted");
    setShowConfirmDelete(false);
    handleClose();
  };

  return (
    <>
      {/* MAIN DETAILS DIALOG */}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
      >
        <DialogContent className="sm:max-w-2xl bg-white rounded-none border-[6px] border-black wireframe-dialog">
          <div className="px-8 py-8 space-y-6">
            {/* HEADER */}
            <DialogHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <DialogTitle className="uppercase tracking-wide font-mono text-xl">
                  {resolvedWorkout.name || "Workout Details"}
                </DialogTitle>
                <Badge className="wireframe-badge">
                  {resolvedWorkout.type}
                </Badge>
              </div>
              <DialogDescription className="font-mono text-sm text-muted-foreground">
                Review, edit, or delete this logged workout.
              </DialogDescription>
            </DialogHeader>

            {/* DATE + DURATION ROW */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {longDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {resolvedWorkout.duration ?? 0} min
              </span>
              <span className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                {totalExercises} ex • {totalSets} sets
              </span>
            </div>

            <Separator className="wireframe-separator" />

            {/* EXERCISES TITLE */}
            <p className="uppercase tracking-wide text-xs font-mono">
              Exercises
            </p>

            {/* EXERCISES LIST */}
            <div className="space-y-3">
              {resolvedWorkout.exercises.map((exercise, idx) => (
                <div
                  key={exercise.id ?? idx}
                  className="border-[2px] border-black bg-white"
                >
                  <div className="border border-dashed border-black/40 m-[3px] px-5 py-4 flex gap-4 items-start">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 font-mono text-sm space-y-1">
                      <p className="uppercase tracking-wide font-semibold">
                        {exercise.name || `Exercise ${idx + 1}`}
                      </p>
                      <p className="text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight
                          ? ` • ${exercise.weight} ${
                              (exercise as any).weightUnit ?? "lbs"
                            }`
                          : ""}
                      </p>
                      {exercise.notes && (
                        <p className="text-xs text-muted-foreground">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTONS – EDIT + DELETE */}
            <div className="pt-4 border-t border-black flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                data-variant="outline"
                className="flex-1 wireframe-button py-4"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Workout
              </Button>
              <Button
                className="flex-1 wireframe-button py-4"
                variant="destructive"
                onClick={() => setShowConfirmDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <WorkoutDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        workout={resolvedWorkout}
      />

      {/* CONFIRM DELETE DIALOG */}
      <Dialog
        open={showConfirmDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setShowConfirmDelete(false);
        }}
      >
        <DialogContent className="sm:max-w-sm bg-white rounded-none border-[6px] border-black wireframe-dialog">
          <div className="px-6 py-6 space-y-4">
            <DialogHeader className="space-y-2">
              <DialogTitle className="uppercase tracking-wide font-mono text-lg">
                Delete Workout?
              </DialogTitle>
              <DialogDescription className="font-mono text-sm text-muted-foreground">
                This will permanently remove this workout and its exercises from
                your history. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 wireframe-button"
                data-variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={actuallyDelete}
                className="flex-1 wireframe-button"
              >
                Delete workout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
