// src/App.tsx
import { MainApp } from "./components/MainApp";
import { LoginScreen } from "./components/LoginScreen";
import { AppProvider, useApp } from "./lib/context";
import { Toaster } from "sonner"; // 👈 add this

function AppContent() {
  const { user } = useApp();

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
      <Toaster
        richColors
        closeButton
        position="top-center"
      />
    </>
  );
}
