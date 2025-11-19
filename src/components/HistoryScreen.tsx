import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useApp } from "../lib/context";
import { WorkoutDetailsDialog } from "./WorkoutDetailsDialog";
import { Workout } from "../types";

type TabKey = "all" | "strength" | "cardio" | "flexibility";

export function HistoryScreen() {
  const { workouts } = useApp();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const formatRelativeDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce(
      (total, exercise) => total + (exercise.sets || 0),
      0
    );
  };

  const renderWorkoutCard = (workout: Workout) => {
    const mainExercise = workout.exercises?.[0];

    return (
      <Card
        key={workout.id}
        className="wireframe-card cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setSelectedWorkout(workout)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg uppercase tracking-wide">
                {workout.name || mainExercise?.name || "Workout"}
              </CardTitle>
              <CardDescription className="flex flex-col gap-1 mt-1 font-mono text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatRelativeDate(workout.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {workout.duration ?? 0} min
                </span>
                {mainExercise && (
                  <span>
                    {mainExercise.sets} × {mainExercise.reps} {mainExercise.name}
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge
              variant={workout.type === "Strength" ? "default" : "secondary"}
              className="wireframe-badge"
            >
              {workout.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between text-sm text-muted-foreground font-mono">
            <span>
              {workout.exercises.length} exercise
              {workout.exercises.length !== 1 ? "s" : ""}
            </span>
            <span>{getTotalSets(workout)} sets</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 wireframe-button"
            data-variant="ghost"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </CardContent>
      </Card>
    );
  };

  const strengthWorkouts = workouts.filter((w) => w.type === "Strength");
  const cardioWorkouts = workouts.filter((w) => w.type === "Cardio");
  const flexibilityWorkouts = workouts.filter((w) => w.type === "Flexibility");

  const renderActiveTabContent = () => {
    if (activeTab === "all") {
      return <div className="space-y-4">{workouts.map(renderWorkoutCard)}</div>;
    }

    if (activeTab === "strength") {
      return strengthWorkouts.length > 0 ? (
        <div className="space-y-4">{strengthWorkouts.map(renderWorkoutCard)}</div>
      ) : (
        <Card className="wireframe-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground font-mono">
              No strength workouts logged
            </p>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "cardio") {
      return cardioWorkouts.length > 0 ? (
        <div className="space-y-4">{cardioWorkouts.map(renderWorkoutCard)}</div>
      ) : (
        <Card className="wireframe-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground font-mono">
              No cardio workouts logged
            </p>
          </CardContent>
        </Card>
      );
    }

    // flexibility
    return flexibilityWorkouts.length > 0 ? (
      <div className="space-y-4">{flexibilityWorkouts.map(renderWorkoutCard)}</div>
    ) : (
      <Card className="wireframe-card">
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground font-mono">
            No flexibility workouts logged
          </p>
        </CardContent>
      </Card>
    );
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "strength", label: "Strength" },
    { key: "cardio", label: "Cardio" },
    { key: "flexibility", label: "Flexibility" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl uppercase tracking-wider font-mono">
          Workout History
        </h1>
      </div>

      {workouts.length === 0 ? (
        <Card className="wireframe-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground font-mono">
              No workouts logged yet
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              Start tracking your fitness journey today!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Custom tab row – using DIVs so global button styles can't break layout */}
          <div
            style={{
              display: "flex",
              width: "100%",
              borderBottom: "2px solid #000",
            }}
          >
            {tabs.map(({ key, label }) => {
              const isActive = activeTab === key;
              return (
                <div
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.75rem",
                    borderTop: "2px solid #000",
                    borderLeft: "2px solid #000",
                    borderRight: "2px solid #000",
                    backgroundColor: isActive ? "#000" : "#fff",
                    color: isActive ? "#fff" : "#000",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    textAlign: "center",
                    userSelect: "none",
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {renderActiveTabContent()}
        </>
      )}

      <WorkoutDetailsDialog
        open={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        workout={selectedWorkout}
      />
    </div>
  );
}
