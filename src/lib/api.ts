// src/lib/api.ts
import type { Workout } from "../types";

const API_BASE = "https://fitlog-backend-nx7y.onrender.com/api/workouts";


// GET /api/workouts or /api/workouts?userId=...
export async function fetchWorkouts(userId?: string): Promise<Workout[]> {
  const url = userId ? `${API_BASE}?userId=${encodeURIComponent(userId)}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load workouts");
  }
  return res.json();
}

// POST /api/workouts
export async function createWorkout(workout: Workout): Promise<Workout> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });

  if (!res.ok) {
    throw new Error("Failed to create workout");
  }
  return res.json();
}

// PUT /api/workouts/{id}
export async function updateWorkoutApi(
  id: string,
  workout: Workout
): Promise<Workout> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });

  if (!res.ok) {
    throw new Error("Failed to update workout");
  }
  return res.json();
}

// DELETE /api/workouts/{id}
export async function deleteWorkoutApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete workout");
  }
}
