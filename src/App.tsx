
import { useEffect } from "react";
import { MainApp } from "./components/MainApp";
import { LoginScreen } from "./components/LoginScreen";
import { AppProvider, useApp } from "./lib/context";
import { Toaster } from "sonner";

function AppContent() {
  const { user, settings } = useApp();

  
  if (!user) {
    return <LoginScreen />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <>
      <AppProvider>
        <AppContent />
      </AppProvider>

      <Toaster richColors closeButton position="top-center" />
    </>
  );
}