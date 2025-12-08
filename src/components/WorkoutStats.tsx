
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { useApp } from "../lib/context";
import {
  summarizeWorkoutsByPeriod,
  TimeRange,
} from "../lib/workoutStats";

const RANGE_LABELS: Record<TimeRange, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

export function WorkoutStats() {
  const { workouts } = useApp();
  const [range, setRange] = useState<TimeRange>("week");

  const summaries = useMemo(
    () => summarizeWorkoutsByPeriod(workouts, range),
    [workouts, range]
  );

  const current = summaries[0];
  const previous = summaries[1];

  return (
    <div className="space-y-4">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="space-y-1">
          <p className="uppercase text-xs font-mono tracking-wide text-muted-foreground">
            Progress report
          </p>
          <h2 className="font-mono text-lg md:text-xl">
            Workout history overview
          </h2>
          <p className="text-xs font-mono text-muted-foreground max-w-md">
            See how your training has changed over time and compare{" "}
            {RANGE_LABELS[range].toLowerCase()} performance.
          </p>
        </div>

        <div className="space-y-1">
          <Label className="uppercase text-[11px] font-mono tracking-wide">
            View by
          </Label>
          <Select
            value={range}
            onValueChange={(val) => setRange(val as TimeRange)}
          >
            <SelectTrigger className="wireframe-input min-w-[9rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="wireframe-separator" />

      {!current ? (
        <p className="font-mono text-sm text-muted-foreground">
          No workouts logged yet. Once you log some workouts, your progress
          report will appear here.
        </p>
      ) : (
        <>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black bg-white px-4 py-3 font-mono text-sm space-y-2">
              <p className="uppercase text-[11px] tracking-wide text-muted-foreground">
                Current {RANGE_LABELS[range]}
              </p>
              <p className="text-base font-semibold">{current.label}</p>
              <p className="text-[11px] text-muted-foreground">
                {current.startDate} – {current.endDate}
              </p>

              <div className="mt-2 space-y-1">
                <p>
                  Workouts:{" "}
                  <span className="font-semibold">
                    {current.workoutCount}
                  </span>
                </p>
                <p>
                  Total duration:{" "}
                  <span className="font-semibold">
                    {current.totalDuration} min
                  </span>
                </p>
                {current.workoutCount > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    Avg per workout:{" "}
                    {Math.round(current.totalDuration / current.workoutCount)}{" "}
                    min
                  </p>
                )}
              </div>
            </div>

            <div className="border border-dashed border-black bg-white px-4 py-3 font-mono text-sm space-y-2">
              <p className="uppercase text-[11px] tracking-wide text-muted-foreground">
                Previous {RANGE_LABELS[range]}
              </p>

              {!previous ? (
                <p className="text-xs text-muted-foreground mt-1">
                  No earlier {RANGE_LABELS[range].toLowerCase()} data yet.
                </p>
              ) : (
                <>
                  <p className="text-base font-semibold">{previous.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {previous.startDate} – {previous.endDate}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p>
                      Workouts:{" "}
                      <span className="font-semibold">
                        {previous.workoutCount}
                      </span>
                    </p>
                    <p>
                      Total duration:{" "}
                      <span className="font-semibold">
                        {previous.totalDuration} min
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BREAKDOWN LIST */}
          <div className="border border-black bg-white font-mono text-xs mt-2">
            <div className="px-4 py-2 border-b border-black/40 flex items-center justify-between">
              <span className="uppercase tracking-wide">
                All {RANGE_LABELS[range]} breakdown
              </span>
              <span className="text-[11px] text-muted-foreground">
                Latest at the top
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-dashed divide-black/30">
              {summaries.map((s) => (
                <div
                  key={s.key}
                  className="px-4 py-2 flex items-center justify-between bg-white"
                >
                  <div>
                    <p className="text-xs font-semibold">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.startDate} – {s.endDate}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground">
                    <p>
                      {s.workoutCount} workout
                      {s.workoutCount !== 1 ? "s" : ""}
                    </p>
                    <p>{s.totalDuration} min total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
