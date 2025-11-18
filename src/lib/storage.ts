import { User, Workout, UserSettings } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'fitlog_current_user',
  USERS: 'fitlog_users',
  WORKOUTS: 'fitlog_workouts',
  SETTINGS: 'fitlog_settings',
};

// User operations
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

// Workout operations
export const saveWorkout = (workout: Workout): void => {
  const workouts = getWorkouts();
  const existingIndex = workouts.findIndex(w => w.id === workout.id);
  
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout;
  } else {
    workouts.push(workout);
  }
  
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
};

export const getWorkouts = (): Workout[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  return data ? JSON.parse(data) : [];
};

export const getUserWorkouts = (userId: string): Workout[] => {
  const workouts = getWorkouts();
  return workouts.filter(w => w.userId === userId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const deleteWorkout = (workoutId: string): void => {
  const workouts = getWorkouts();
  const filtered = workouts.filter(w => w.id !== workoutId);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
};

// Settings operations
export const saveSettings = (userId: string, settings: UserSettings): void => {
  const allSettings = getAllSettings();
  allSettings[userId] = settings;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(allSettings));
};

export const getSettings = (userId: string): UserSettings => {
  const allSettings = getAllSettings();
  return allSettings[userId] || getDefaultSettings();
};

const getAllSettings = (): Record<string, UserSettings> => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {};
};

const getDefaultSettings = (): UserSettings => ({
  notifications: {
    workoutReminders: true,
    achievements: true,
    dailyTips: true,
  },
  reminderTime: '18:00',
  darkMode: false,
  dataBackup: true,
});
