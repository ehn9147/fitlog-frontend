import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useApp } from "../lib/context";
import { WorkoutDetailsDialog } from "./WorkoutDetailsDialog";
import { Workout } from "../types";

export function HistoryScreen() {
  const { workouts } = useApp();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets, 0);
  };

  const renderWorkoutCard = (workout: Workout) => (
    <Card key={workout.id} className="wireframe-card cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedWorkout(workout)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg uppercase tracking-wide">{workout.name}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatRelativeDate(workout.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {workout.duration} min
              </span>
            </CardDescription>
          </div>
          <Badge variant={workout.type === "Strength" ? "default" : "secondary"} className="wireframe-badge">
            {workout.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between text-sm text-muted-foreground font-mono">
          <span>{workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}</span>
          <span>{getTotalSets(workout)} sets</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-3 wireframe-button" data-variant="ghost">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl uppercase tracking-wider font-mono">Workout History</h1>
      </div>

      {workouts.length === 0 ? (
        <Card className="wireframe-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground font-mono">No workouts logged yet</p>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              Start tracking your fitness journey today!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="wireframe-tab">All</TabsTrigger>
            <TabsTrigger value="strength" className="wireframe-tab">Strength</TabsTrigger>
            <TabsTrigger value="cardio" className="wireframe-tab">Cardio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {workouts.map(renderWorkoutCard)}
          </TabsContent>
          
          <TabsContent value="strength" className="space-y-4">
            {workouts.filter(w => w.type === "Strength").length > 0 ? (
              workouts.filter(w => w.type === "Strength").map(renderWorkoutCard)
            ) : (
              <Card className="wireframe-card">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground font-mono">No strength workouts logged</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="cardio" className="space-y-4">
            {workouts.filter(w => w.type === "Cardio").length > 0 ? (
              workouts.filter(w => w.type === "Cardio").map(renderWorkoutCard)
            ) : (
              <Card className="wireframe-card">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground font-mono">No cardio workouts logged</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      <WorkoutDetailsDialog
        open={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        workout={selectedWorkout}
      />
    </div>
  );
}