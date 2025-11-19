// src/lib/context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Workout, UserSettings } from "../types";

import {
  getCurrentUser,
  setCurrentUser,
  getUserWorkouts,
  saveWorkout as saveWorkoutToStorage,
  deleteWorkout as deleteWorkoutFromStorage,
  getSettings,
  saveSettings as saveSettingsToStorage,
  saveUser as saveUserToStorage,
} from "./storage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface AppContextType {
  user: User | null;
  workouts: Workout[];
  settings: UserSettings | null;
  login: (user: User) => void;
  logout: () => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  updateUser: (user: User) => void;
  updateSettings: (settings: UserSettings) => void;
  refreshWorkouts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ---- API helpers ----

async function fetchWorkoutsFromApi(userId: string): Promise<Workout[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/workouts?userId=${encodeURIComponent(userId)}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch workouts: ${res.status}`);
  }
  return res.json();
}

async function createWorkoutInApi(workout: Workout): Promise<Workout> {
  const res = await fetch(`${API_BASE_URL}/api/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });
  if (!res.ok) {
    throw new Error(`Failed to create workout: ${res.status}`);
  }
  return res.json();
}

async function updateWorkoutInApi(workout: Workout): Promise<Workout> {
  const res = await fetch(
    `${API_BASE_URL}/api/workouts/${encodeURIComponent(workout.id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to update workout: ${res.status}`);
  }
  return res.json();
}

async function deleteWorkoutInApi(id: string): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/api/workouts/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to delete workout: ${res.status}`);
  }
}

// ---- Context implementation ----

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Load user + settings + workouts on startup
  useEffect(() => {
    const existingUser = getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
      loadSettings(existingUser);
      loadWorkouts(existingUser);
    }
  }, []);

  const loadSettings = (u: User) => {
    const storedSettings = getSettings(u.id);
    if (storedSettings) {
      setSettings(storedSettings);
    } else {
      const defaultSettings: UserSettings = {
        userId: u.id,
        darkMode: false,
        dataBackup: false,
        reminderTime: "18:00",
        notifications: {
          workoutReminders: true,
          achievements: true,
          dailyTips: true,
        },
      };
      setSettings(defaultSettings);
      saveSettingsToStorage(defaultSettings);
    }
  };

  const loadWorkouts = async (u: User) => {
    try {
      const apiWorkouts = await fetchWorkoutsFromApi(u.id);
      setWorkouts(apiWorkouts);
    } catch (err) {
      console.warn("API workouts failed, using local storage instead:", err);
      const localWorkouts = getUserWorkouts(u.id) || [];
      setWorkouts(localWorkouts);
    }
  };

  // ⭐ LOGIN: remember account + set current session (no redirect)
  const login = (u: User) => {
    // remember this account on this device
    saveUserToStorage(u); // goes into fitlog_users

    // set as current session
    setUser(u);
    setCurrentUser(u); // goes into fitlog_current_user

    // load per-user state
    loadSettings(u);
    loadWorkouts(u);
  };

  // ⭐ LOGOUT: clear current session (no redirect)
  const logout = () => {
    // Clear React state
    setUser(null);
    setWorkouts([]);
    setSettings(null);

    // Clear the current user from localStorage directly
    try {
      localStorage.removeItem("fitlog_current_user");
    } catch (err) {
      console.error("Failed to clear current user from storage", err);
    }
  };

  const refreshWorkouts = () => {
    if (user) {
      loadWorkouts(user);
    }
  };

  const addWorkout = (workout: Workout) => {
    if (!user) return;

    // make sure workout is tied to the current user
    const workoutWithUser: Workout = { ...workout, userId: user.id };

    (async () => {
      try {
        const saved = await createWorkoutInApi(workoutWithUser);
        setWorkouts((prev) => [saved, ...prev]);
        saveWorkoutToStorage(saved);
      } catch (err) {
        console.error(
          "Failed to add workout via API, saving locally:",
          err
        );
        saveWorkoutToStorage(workoutWithUser);
        setWorkouts((prev) => [workoutWithUser, ...prev]);
      }
    })();
  };

  const updateWorkout = (workout: Workout) => {
    if (!user) return;

    const workoutWithUser: Workout = { ...workout, userId: user.id };

    (async () => {
      try {
        const saved = await updateWorkoutInApi(workoutWithUser);
        setWorkouts((prev) =>
          prev.map((w) => (w.id === saved.id ? saved : w))
        );
        saveWorkoutToStorage(saved);
      } catch (err) {
        console.error(
          "Failed to update workout via API, updating locally:",
          err
        );
        setWorkouts((prev) =>
          prev.map((w) =>
            w.id === workoutWithUser.id ? workoutWithUser : w
          )
        );
        saveWorkoutToStorage(workoutWithUser);
      }
    })();
  };

  const deleteWorkout = (id: string) => {
    if (!user) return;

    (async () => {
      try {
        await deleteWorkoutInApi(id);
      } catch (err) {
        console.error(
          "Failed to delete workout via API, deleting locally:",
          err
        );
      } finally {
        deleteWorkoutFromStorage(id);
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
      }
    })();
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    setCurrentUser(updated);
    saveUserToStorage(updated);
  };

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  const value: AppContextType = {
    user,
    workouts,
    settings,
    login,
    logout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    updateUser,
    updateSettings,
    refreshWorkouts,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}
