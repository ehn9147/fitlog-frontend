// src/lib/workoutStats.ts
import { Workout } from "../types";

export type TimeRange = "day" | "week" | "month" | "year";

export interface PeriodSummary {
  key: string;          // internal key like "2025-03-01" or "2025-W10"
  label: string;        // nice label to show in UI
  startDate: string;    // ISO date (YYYY-MM-DD)
  endDate: string;      // ISO date
  workoutCount: number;
  totalDuration: number; // in minutes
}

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const normalized = dateStr.includes("T")
    ? dateStr
    : `${dateStr}T00:00:00`;
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

// ISO week number helper (rough but good enough)
function getISOWeek(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7; // 1–7, Mon–Sun
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return { year: date.getUTCFullYear(), week };
}

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function summarizeWorkoutsByPeriod(
  workouts: Workout[],
  range: TimeRange
): PeriodSummary[] {
  const map = new Map<string, PeriodSummary>();

  for (const workout of workouts) {
    const d = parseDate(workout.date);
    if (!d) continue;

    let key: string;
    let label: string;
    let periodStart: Date;
    let periodEnd: Date;

    const year = d.getFullYear();
    const month = d.getMonth(); // 0–11

    switch (range) {
      case "day": {
        key = toISODate(d);
        label = d.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        periodStart = new Date(year, month, d.getDate());
        periodEnd = new Date(year, month, d.getDate());
        break;
      }
      case "week": {
        const { year: weekYear, week } = getISOWeek(d);
        key = `${weekYear}-W${String(week).padStart(2, "0")}`;
        label = `Week ${week}, ${weekYear}`;
        // rough start/end of week (Mon–Sun)
        const day = d.getDay() || 7;
        periodStart = new Date(d);
        periodStart.setDate(d.getDate() - (day - 1));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        break;
      }
      case "month": {
        key = `${year}-${String(month + 1).padStart(2, "0")}`;
        label = d.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        });
        periodStart = new Date(year, month, 1);
        periodEnd = new Date(year, month + 1, 0); // last day of month
        break;
      }
      case "year":
      default: {
        key = `${year}`;
        label = `${year}`;
        periodStart = new Date(year, 0, 1);
        periodEnd = new Date(year, 11, 31);
        break;
      }
    }

    const existing = map.get(key);
    const duration = workout.duration ?? 0;

    if (!existing) {
      map.set(key, {
        key,
        label,
        startDate: toISODate(periodStart),
        endDate: toISODate(periodEnd),
        workoutCount: 1,
        totalDuration: duration,
      });
    } else {
      existing.workoutCount += 1;
      existing.totalDuration += duration;
    }
  }

  const summaries = Array.from(map.values());
  summaries.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  return summaries;
}
