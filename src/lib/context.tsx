
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
  getSettings,
  saveSettings as saveSettingsToStorage,
  saveUser as saveUserToStorage,
} from "./storage";

import {
  fetchWorkouts as fetchWorkoutsFromApi,
  createWorkout as createWorkoutInApi,
  updateWorkoutApi as updateWorkoutInApi,
  deleteWorkoutApi as deleteWorkoutInApi,
} from "./api";

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
      console.error("Failed to load workouts from API:", err);
      setWorkouts([]); 
    }
  };

  //  LOGIN
  const login = (u: User) => {
    saveUserToStorage(u);
    setUser(u);
    setCurrentUser(u);
    loadSettings(u);
    loadWorkouts(u);
  };

  //  LOGOUT
  const logout = () => {
    setUser(null);
    setWorkouts([]);
    setSettings(null);

    try {
      localStorage.removeItem("fitlog_current_user");
      localStorage.removeItem("fitlog-active-tab");
    } catch (err) {
      console.error("Failed to clear local storage on logout", err);
    }
  };

  const refreshWorkouts = () => {
    if (user) {
      loadWorkouts(user);
    }
  };

  const addWorkout = (workout: Workout) => {
    if (!user) return;

    const workoutWithUser: Workout = { ...workout, userId: user.id };

    (async () => {
      try {
        const saved = await createWorkoutInApi(workoutWithUser);
        setWorkouts((prev) => [saved, ...prev]);
      } catch (err) {
        console.error("Failed to add workout via API:", err);
      }
    })();
  };

  const updateWorkout = (workout: Workout) => {
    if (!user) return;
    if (!workout.id) {
      console.error("Workout id is required for update");
      return;
    }

    const workoutWithUser: Workout = { ...workout, userId: user.id };

    (async () => {
      try {
        const saved = await updateWorkoutInApi(workoutWithUser.id, workoutWithUser);
        setWorkouts((prev) =>
          prev.map((w) => (w.id === saved.id ? saved : w))
        );
      } catch (err) {
        console.error("Failed to update workout via API:", err);
      }
    })();
  };

  const deleteWorkout = (id: string) => {
    if (!user) return;

    (async () => {
      try {
        await deleteWorkoutInApi(id);
      } catch (err) {
        console.error("Failed to delete workout via API:", err);
      } finally {
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
