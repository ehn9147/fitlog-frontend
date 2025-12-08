import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useApp } from "../lib/context";
import { WorkoutDetailsDialog } from "./WorkoutDetailsDialog";
import { Workout } from "../types";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ProgressReportDialog } from "./ProgressReportDialog"; // 👈 NEW

type TabKey = "all" | "strength" | "cardio" | "flexibility";
type TimeFilter = "all" | "day" | "week" | "month" | "year";

function parseDateSafe(dateString: string) {
  if (!dateString) return null;
  const normalized = dateString.includes("T")
    ? dateString
    : `${dateString}T00:00:00`;
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
}

function passesTimeFilter(workout: Workout, filter: TimeFilter) {
  if (filter === "all") return true;

  const date = parseDateSafe(workout.date);
  if (!date) return false;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  switch (filter) {
    case "day":
      return diffDays <= 1;
    case "week":
      return diffDays <= 7;
    case "month":
      return diffDays <= 30;
    case "year":
      return diffDays <= 365;
    default:
      return true;
  }
}

export function HistoryScreen() {
  const { workouts } = useApp();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [showReport, setShowReport] = useState(false); // 👈 NEW

  const filteredWorkouts = workouts.filter((w) =>
    passesTimeFilter(w, timeFilter)
  );

  const formatRelativeDate = (dateString: string) => {
    const date = parseDateSafe(dateString);
    if (!date) return dateString || "Unknown date";

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
                    {mainExercise.sets} × {mainExercise.reps}{" "}
                    {mainExercise.name}
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

  const strengthWorkouts = filteredWorkouts.filter(
    (w) => w.type === "Strength"
  );
  const cardioWorkouts = filteredWorkouts.filter((w) => w.type === "Cardio");
  const flexibilityWorkouts = filteredWorkouts.filter(
    (w) => w.type === "Flexibility"
  );

  const renderActiveTabContent = () => {
    if (activeTab === "all") {
      return filteredWorkouts.length > 0 ? (
        <div className="space-y-4">
          {filteredWorkouts.map(renderWorkoutCard)}
        </div>
      ) : (
        <Card className="wireframe-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground font-mono">
              No workouts in this time range
            </p>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "strength") {
      return strengthWorkouts.length > 0 ? (
        <div className="space-y-4">
          {strengthWorkouts.map(renderWorkoutCard)}
        </div>
      ) : (
        <Card className="wireframe-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground font-mono">
              No strength workouts in this time range
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
              No cardio workouts in this time range
            </p>
          </CardContent>
        </Card>
      );
    }

    return flexibilityWorkouts.length > 0 ? (
      <div className="space-y-4">
        {flexibilityWorkouts.map(renderWorkoutCard)}
      </div>
    ) : (
      <Card className="wireframe-card">
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground font-mono">
            No flexibility workouts in this time range
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
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-2xl uppercase tracking-wider font-mono">
          Workout History
        </h1>

        <div className="flex items-center gap-2">
          <Label className="uppercase tracking-wide text-xs font-mono">
            Time range
          </Label>
          <Select
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
          >
            <SelectTrigger className="wireframe-input min-w-[9rem]">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          {/* 👇 New button to open progress report */}
          <Button
            type="button"
            variant="outline"
            className="wireframe-button ml-2"
            data-variant="outline"
            onClick={() => setShowReport(true)}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress Report
          </Button>
        </div>
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

      {/* 📊 Progress report dialog */}
      <ProgressReportDialog
        open={showReport}
        onClose={() => setShowReport(false)}
      />
    </div>
  );
}

