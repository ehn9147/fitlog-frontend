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
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Plus, X } from "lucide-react";
import { Workout, Exercise } from "../types";
import { useApp } from "../lib/context";
import { toast } from "sonner";

interface WorkoutDialogProps {
  open: boolean;
  onClose: () => void;
  workout?: Workout | null;
}

const createEmptyExercise = (): Exercise => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`,
  name: "",
  sets: 3,
  reps: 10,
  weight: 0,
});

export function WorkoutDialog({ open, onClose, workout }: WorkoutDialogProps) {
  const { user, addWorkout, updateWorkout } = useApp();
  const [name, setName] = useState(workout?.name || "");
  const [type, setType] = useState<string>(workout?.type || "Strength");
  const [date, setDate] = useState(
    workout?.date || new Date().toISOString().split("T")[0]
  );
  const [duration, setDuration] = useState(
    workout?.duration !== undefined ? workout.duration.toString() : ""
  );
  const [notes, setNotes] = useState(workout?.notes || "");
  const [exercises, setExercises] = useState<Exercise[]>(
    workout?.exercises && workout.exercises.length > 0
      ? workout.exercises
      : [createEmptyExercise()]
  );

  useEffect(() => {
    if (workout) {
      setName(workout.name);
      setType(workout.type);
      setDate(workout.date);
      setDuration(workout.duration.toString());
      setNotes(workout.notes || "");
      setExercises(
        workout.exercises.length > 0
          ? workout.exercises
          : [createEmptyExercise()]
      );
    } else if (open) {
      setName("");
      setType("Strength");
      setDate(new Date().toISOString().split("T")[0]);
      setDuration("");
      setNotes("");
      setExercises([createEmptyExercise()]);
    }
  }, [workout, open]);

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, createEmptyExercise()]);
  };

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExerciseChange = (
    id: string,
    field: keyof Exercise,
    value: string | number
  ) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleClose = () => {
    setName("");
    setType("Strength");
    setDate(new Date().toISOString().split("T")[0]);
    setDuration("");
    setNotes("");
    setExercises([createEmptyExercise()]);
    onClose();
  };

  const handleSave = () => {
    if (!user || !name.trim() || !duration.trim()) {
      toast.error("Please fill in Workout Name and Duration");
      return;
    }

    const workoutData: Workout = {
      id: workout?.id || Date.now().toString(),
      userId: user.id,
      name: name.trim(),
      type: type as Workout["type"],
      date,
      duration: parseInt(duration, 10),
      exercises: exercises.filter((e) => e.name.trim() !== ""),
      notes: notes.trim(),
    };

    if (workout) {
      updateWorkout(workoutData);
      toast.success("Workout updated successfully");
    } else {
      addWorkout(workoutData);
      toast.success("Workout logged successfully");
    }

    handleClose();
  };

  const isFormValid = name.trim() !== "" && duration.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-none border-[6px] border-black py-8">
        <div className="px-10">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wide font-mono">
              {workout ? "Edit Workout" : "Log New Workout"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="uppercase tracking-wide">
                  Workout Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Upper Body"
                  className="wireframe-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="uppercase tracking-wide">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="uppercase tracking-wide">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="wireframe-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="uppercase tracking-wide">
                  Duration (min) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="45"
                  className="wireframe-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="uppercase tracking-wide">Exercises</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExercise}
                  className="wireframe-button"
                  data-variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {exercises.map((exercise) => (
                  <Card key={exercise.id} className="wireframe-card">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <Input
                          value={exercise.name}
                          onChange={(e) =>
                            handleExerciseChange(
                              exercise.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Exercise name"
                          className="wireframe-input"
                        />
                        {exercises.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExercise(exercise.id)}
                            className="wireframe-button"
                            data-variant="ghost"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs uppercase tracking-wide">
                            Sets
                          </Label>
                          <Input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleExerciseChange(
                                exercise.id,
                                "sets",
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="wireframe-input"
                          />
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-wide">
                            Reps
                          </Label>
                          <Input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleExerciseChange(
                                exercise.id,
                                "reps",
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="wireframe-input"
                          />
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-wide">
                            Weight (lbs)
                          </Label>
                          <Input
                            type="number"
                            value={exercise.weight || ""}
                            onChange={(e) =>
                              handleExerciseChange(
                                exercise.id,
                                "weight",
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="wireframe-input"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="uppercase tracking-wide">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the workout go?"
                className="wireframe-input"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              {!isFormValid && (
                <div className="p-2 bg-muted rounded text-center">
                  <p className="text-sm text-muted-foreground font-mono">
                    * Required: Workout Name and Duration
                  </p>
                </div>
              )}
              <div className="flex gap-3">
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
                  disabled={!isFormValid}
                  className="flex-1 wireframe-button"
                >
                  {workout ? "Save Changes" : "Log Workout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
