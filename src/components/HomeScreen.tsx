import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { useApp } from "../lib/context";
import { WorkoutDialog } from "./WorkoutDialog";
import { WorkoutDetailsDialog } from "./WorkoutDetailsDialog";
import { Workout } from "../types";

export function HomeScreen() {
  const { user, workouts } = useApp();
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [showLogPrevious, setShowLogPrevious] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Calculate weekly progress
  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    return new Date(now.setDate(diff));
  };

  const weekStart = getWeekStart();
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= weekStart;
  });

  const weeklyProgress = user ? (thisWeekWorkouts.length / user.weeklyGoal) * 100 : 0;
  const recentWorkouts = workouts.slice(0, 2);

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays === 3) return '2 days ago';
    return `${diffDays - 1} days ago`;
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
            {thisWeekWorkouts.length} of {user?.weeklyGoal || 4} workouts completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={Math.min(weeklyProgress, 100)} className="mb-2 wireframe-progress" />
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {thisWeekWorkouts.length >= (user?.weeklyGoal || 4)
              ? "Goal achieved! Keep up the great work!"
              : `${(user?.weeklyGoal || 4) - thisWeekWorkouts.length} more workout${(user?.weeklyGoal || 4) - thisWeekWorkouts.length === 1 ? '' : 's'} to reach your goal!`}
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
            onClick={() => setShowNewWorkout(true)}
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
            recentWorkouts.map((workout) => (
              <div 
                key={workout.id}
                className="flex justify-between items-center p-3 bg-muted wireframe-card cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setSelectedWorkout(workout)}
              >
                <div>
                  <div className="font-medium uppercase tracking-wide">{workout.name}</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {formatRelativeDate(workout.date)} • {workout.duration} min
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <WorkoutDialog 
        open={showNewWorkout} 
        onClose={() => setShowNewWorkout(false)} 
      />
      
      <WorkoutDialog 
        open={showLogPrevious} 
        onClose={() => setShowLogPrevious(false)} 
      />

      <WorkoutDetailsDialog
        open={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        workout={selectedWorkout}
      />
    </div>
  );
}