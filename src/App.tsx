// src/App.tsx
import { useApp } from "./lib/context";
import { LoginScreen } from "./components/LoginScreen";
import { MainApp } from "./components/MainApp";

export default function App() {
  const { user } = useApp();

  // If no logged-in user, show login screen
  if (!user) {
    return <LoginScreen />;
  }

  // If logged in, show the main tabbed app
  return <MainApp />;
}

