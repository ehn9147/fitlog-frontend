import type { Workout } from "../types";

// 👇 Base URL comes from .env (VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_BASE = `${API_BASE_URL}/api/workouts`;

// Payload for creating/updating workouts (no id in body for create)
export type NewWorkoutPayload = Omit<Workout, "id">;

// GET /api/workouts or /api/workouts?userId=...
export async function fetchWorkouts(userId?: string): Promise<Workout[]> {
  const url = userId
    ? `${API_BASE}?userId=${encodeURIComponent(userId)}`
    : API_BASE;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load workouts");
  }
  return res.json();
}

// POST /api/workouts
export async function createWorkout(
  payload: NewWorkoutPayload
): Promise<Workout> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create workout");
  }

  return res.json();
}

// PUT /api/workouts/{id}
export async function updateWorkoutApi(
  id: string,
  payload: NewWorkoutPayload
): Promise<Workout> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
