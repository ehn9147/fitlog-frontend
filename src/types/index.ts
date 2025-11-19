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
