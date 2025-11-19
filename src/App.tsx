// src/App.tsx
import { useEffect } from "react";
import { MainApp } from "./components/MainApp";
import { LoginScreen } from "./components/LoginScreen";
import { AppProvider, useApp } from "./lib/context";
import { Toaster } from "sonner";

function AppContent() {
  const { user, settings } = useApp();

  // 🔆 Dark mode toggle: add/remove `dark` class on <html>
  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.darkMode]);

  // If there's no user, only show login
  if (!user) {
    return <LoginScreen />;
  }

  // Once logged in, show the main app (home/history/settings)
  return <MainApp />;
}

export default function App() {
  return (
    <>
      <AppProvider>
        <AppContent />
      </AppProvider>

      {/* 👇 sonner toast container – must be rendered once */}
      <Toaster richColors closeButton position="top-center" />
    </>
  );
}
