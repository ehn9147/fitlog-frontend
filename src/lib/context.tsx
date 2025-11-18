import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, Workout, UserSettings } from "../types";
import {
  getCurrentUser,
  setCurrentUser,
  getSettings,
  saveSettings as saveSettingsToStorage,
  saveUser as saveUserToStorage,
} from "./storage";
import {
  fetchWorkouts,
  createWorkout,
  updateWorkoutApi,
  deleteWorkoutApi,
} from "./api";

interface AppContextType {
  user: User | null;
  workouts: Workout[];
  settings: UserSettings | null;
  login: (user: User) => void;
  logout: () => void;
  addWorkout: (workout: Workout) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  updateUser: (user: User) => void;
  updateSettings: (settings: UserSettings) => void;
  refreshWorkouts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Helper: load workouts from backend for a specific user
  const loadWorkoutsFromBackend = async (userId: string) => {
    try {
      const data = await fetchWorkouts(userId);
      setWorkouts(data);
    } catch (err) {
      console.error("Error loading workouts from backend:", err);
      setWorkouts([]);
    }
  };

  // Initialize on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setSettings(getSettings(currentUser.id));
      void loadWorkoutsFromBackend(currentUser.id);
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    setCurrentUser(newUser);
    setSettings(getSettings(newUser.id));
    void loadWorkoutsFromBackend(newUser.id);
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    setWorkouts([]);
    setSettings(null);
  };

  // Create workout in backend
  const addWorkout = async (workout: Workout) => {
    if (!user) return;

    try {
      const payload: Workout = {
        ...workout,
        userId: user.id,
      };

      const created = await createWorkout(payload);
      setWorkouts((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create workout", err);
    }
  };

  // Update workout in backend
  const updateWorkout = async (workout: Workout) => {
    if (!user || !workout.id) return;

    try {
      const payload: Workout = {
        ...workout,
        userId: user.id,
      };

      const updated = await updateWorkoutApi(workout.id, payload);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === updated.id ? updated : w))
      );
    } catch (err) {
      console.error("Failed to update workout", err);
    }
  };

  // Delete workout in backend
  const deleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkoutApi(workoutId);
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
    } catch (err) {
      console.error("Failed to delete workout", err);
    }
  };

  const updateUser = (updatedUser: User) => {
    saveUserToStorage(updatedUser);
    setUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const updateSettings = (newSettings: UserSettings) => {
    if (user) {
      saveSettingsToStorage(user.id, newSettings);
      setSettings(newSettings);
    }
  };

  const refreshWorkouts = async () => {
    if (!user) {
      setWorkouts([]);
      return;
    }

    await loadWorkoutsFromBackend(user.id);
  };

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

