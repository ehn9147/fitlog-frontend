// src/components/MainApp.tsx
import { useState, useEffect } from "react";
import { HomeScreen } from "./HomeScreen";
import { HistoryScreen } from "./HistoryScreen";
import { SettingsScreen } from "./SettingsScreen";
import { Button } from "./ui/button";
import { Home, History, Settings } from "lucide-react";

type TabKey = "home" | "history" | "settings";

const STORAGE_KEY = "fitlog-active-tab";

export function MainApp() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window === "undefined") return "home";
    const stored = window.localStorage.getItem(STORAGE_KEY) as TabKey | null;
    if (stored === "home" || stored === "history" || stored === "settings") {
      return stored;
    }
    return "home";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, activeTab);
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "history":
        return <HistoryScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-auto p-4 pb-20">{renderContent()}</div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border wireframe-nav">
        <div className="flex justify-around items-center py-2 px-4">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 font-mono wireframe-button"
            data-variant={activeTab === "home" ? "default" : "ghost"}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wide">Home</span>
          </Button>

          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 font-mono wireframe-button"
            data-variant={activeTab === "history" ? "default" : "ghost"}
          >
            <History className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wide">History</span>
          </Button>

          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 font-mono wireframe-button"
            data-variant={activeTab === "settings" ? "default" : "ghost"}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wide">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
