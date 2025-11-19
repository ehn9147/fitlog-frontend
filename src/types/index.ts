export interface User {
  id: string;
  name: string;
  email: string;
  weeklyGoal: number;
  createdAt: string;
}

export interface Exercise {
  // id is optional so we can create new exercises without sending an id;
  // the backend will generate it.
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  type: "Strength" | "Cardio" | "Flexibility" | "Other";
  date: string;
  duration: number; // in minutes
  exercises: Exercise[];
  notes?: string;
}

export interface UserSettings {
  notifications: {
    workoutReminders: boolean;
    achievements: boolean;
    dailyTips: boolean;
  };
  reminderTime: string;
  darkMode: boolean;
  dataBackup: boolean;
}
body {
  background-color: #ffffff;
  color: #000000;
}

.wireframe-card {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.15);
}

.wireframe-button[data-variant="default"],
.wireframe-button:not([data-variant]) {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
}

.wireframe-button[data-variant="outline"] {
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
}

.wireframe-button[data-variant="ghost"] {
  color: #000000;
}

.wireframe-avatar {
  border: 1px solid rgba(0,0,0,0.2);
}

.wireframe-separator {
  background: rgba(0,0,0,0.15);
}

/* ===================================== */
/*               DARK MODE               */
/* ===================================== */

.dark body {
  background-color: #000000;
  color: #ffffff;
}

.dark .wireframe-card {
  background: #111111;
  border: 1px solid rgba(255,255,255,0.2);
}

.dark .wireframe-button[data-variant="default"],
.dark .wireframe-button:not([data-variant]) {
  background: #ffffff;
  color: #000000;
  border: 1px solid #ffffff;
}

.dark .wireframe-button[data-variant="outline"] {
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.dark .wireframe-button[data-variant="ghost"] {
  color: #ffffff;
}

.dark .wireframe-avatar {
  border: 1px solid rgba(255,255,255,0.2);
}

.dark .wireframe-separator {
  background: rgba(255,255,255,0.2);
}