import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Calendar, Target, TrendingUp } from "lucide-react";
import { useApp } from "../lib/context";
import { WorkoutDialog } from "./WorkoutDialog";
import { WorkoutDetailsDialog } from "./WorkoutDetailsDialog";
import { Workout } from "../types";
import { StartWorkoutDialog } from "./StartWorkoutDialog";

export function HomeScreen() {
  const { user, workouts } = useApp();
  const [showStartWorkout, setShowStartWorkout] = useState(false);
  const [showLogPrevious, setShowLogPrevious] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Safely get week start (Sunday)
  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - dayOfWeek);
    return start;
  };

  const weekStart = getWeekStart();

  const thisWeekWorkouts = workouts.filter((w) => {
    if (!w.date) return false;
    const workoutDate = new Date(w.date);
    if (isNaN(workoutDate.getTime())) return false;
    return workoutDate >= weekStart;
  });

  const weeklyGoal = user?.weeklyGoal && user.weeklyGoal > 0 ? user.weeklyGoal : 4;
  const weeklyProgress = (thisWeekWorkouts.length / weeklyGoal) * 100;

  // Assume workouts array is already sorted newest → oldest in context.
  const recentWorkouts = workouts.slice(0, 2);

  const formatRelativeDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fall back to raw

    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Ready for today's workout?</p>
      </div>

      {/* Weekly Goal Progress */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
            <Target className="w-5 h-5" />
            Weekly Goal
          </CardTitle>
          <CardDescription className="font-mono">
            {thisWeekWorkouts.length} of {weeklyGoal} workouts completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={Math.min(weeklyProgress, 100)}
            className="mb-2 wireframe-progress"
          />
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {thisWeekWorkouts.length >= weeklyGoal
              ? "Goal achieved! Keep up the great work!"
              : `${weeklyGoal - thisWeekWorkouts.length} more workout${
                  weeklyGoal - thisWeekWorkouts.length === 1 ? "" : "s"
                } to reach your goal!`}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start wireframe-button"
            variant="outline"
            data-variant="outline"
            onClick={() => setShowStartWorkout(true)}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Start New Workout
          </Button>
          <Button
            className="w-full justify-start wireframe-button"
            variant="outline"
            data-variant="outline"
            onClick={() => setShowLogPrevious(true)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Log Previous Workout
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono">
              <p>No workouts logged yet</p>
              <p className="text-sm mt-2">Start your fitness journey today!</p>
            </div>
          ) : (
            recentWorkouts.map((workout) => {
              const mainExercise = workout.exercises?.[0];

              return (
                <div
                  key={workout.id}
                  className="flex justify-between items-center p-3 bg-muted wireframe-card cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setSelectedWorkout(workout)}
                >
                  <div>
                    <div className="font-medium uppercase tracking-wide">
                      {workout.name || mainExercise?.name || "Workout"}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                      <span>
                        {formatRelativeDate(workout.date)} •{" "}
                        {workout.duration ?? 0} min
                      </span>
                      {mainExercise && (
                        <span>
                          • {mainExercise.sets} × {mainExercise.reps}{" "}
                          {mainExercise.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {!mainExercise && (
                    <div className="text-sm text-muted-foreground font-mono">
                      {workout.exercises.length} exercise
                      {workout.exercises.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Start New Workout – suggestion only */}
      <StartWorkoutDialog
        open={showStartWorkout}
        onClose={() => setShowStartWorkout(false)}
      />

      {/* Log Previous Workout – full logging dialog */}
      <WorkoutDialog
        open={showLogPrevious}
        onClose={() => setShowLogPrevious(false)}
      />

      {/* Details dialog for recent workouts */}
      <WorkoutDetailsDialog
        open={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        workout={selectedWorkout}
      />
    </div>
  );
}
