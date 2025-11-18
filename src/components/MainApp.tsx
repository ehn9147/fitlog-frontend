import { useState, useEffect } from "react";
import { HomeScreen } from "./HomeScreen";
import { HistoryScreen } from "./HistoryScreen";
import { SettingsScreen } from "./SettingsScreen";
import { Button } from "./ui/button";
import { Home, History, Settings } from "lucide-react";

export function MainApp() {
  // Backend data
  const [workouts, setWorkouts] = useState<Array<{
    id: number;
    exercise: string;
    sets: number;
    reps: number;
  }>>([]);

 
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

 
  useEffect(() => {
    fetch("http://localhost:8080/api/workouts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded workouts:", data);
        setWorkouts(data);
      })
      .catch((err) => {
        console.error("Failed to load workouts", err);
      });
  }, []);

  
  const addWorkout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!exercise || !sets || !reps) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercise,
          sets: Number(sets),
          reps: Number(reps),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save workout");
      }

      const saved = await res.json();

      // Update UI with new workout
      setWorkouts((prev) => [...prev, saved]);

      // Clear form
      setExercise("");
      setSets("");
      setReps("");
    } catch (err) {
      console.error(err);
      alert("Error saving workout");
    }
  };

  // Delete a workout in the backend
  const deleteWorkout = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/workouts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete workout");
      }

      // Remove it from UI
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting workout");
    }
  };

  // Tab state
  const [activeTab, setActiveTab] = useState<"home" | "history" | "settings">(
    "home"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            workouts={workouts}
            exercise={exercise}
            sets={sets}
            reps={reps}
            setExercise={setExercise}
            setSets={setSets}
            setReps={setReps}
            addWorkout={addWorkout}
          />
        );
      case "history":
        return (
          <HistoryScreen
            workouts={workouts}
            deleteWorkout={deleteWorkout}
          />
        );
      case "settings":
        return <SettingsScreen />;
      default:
        return <HomeScreen
          workouts={workouts}
          exercise={exercise}
          sets={sets}
          reps={reps}
          setExercise={setExercise}
          setSets={setSets}
          setReps={setReps}
          addWorkout={addWorkout}
        />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border wireframe-nav">
        <div className="flex justify-around items-center py-2 px-4">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 font-mono wireframe-button`}
            data-variant={activeTab === "home" ? "default" : "ghost"}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wide">Home</span>
          </Button>

          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 font-mono wireframe-button`}
            data-variant={activeTab === "history" ? "default" : "ghost"}
          >
            <History className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wide">History</span>
          </Button>

          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 font-mono wireframe-button`}
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
