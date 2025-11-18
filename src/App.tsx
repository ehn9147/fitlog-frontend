import { AppProvider, useApp } from "./lib/context";
import { LoginScreen } from "./components/LoginScreen";
import { MainApp } from "./components/MainApp";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { user } = useApp();

  if (!user) {
    return <LoginScreen />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
}