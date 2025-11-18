import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  User, 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Edit,
  Target,
  Calendar
} from "lucide-react";
import { useApp } from "../lib/context";
import { EditProfileDialog } from "./EditProfileDialog";
import { toast } from "sonner@2.0.3";

export function SettingsScreen() {
  const { user, settings, updateSettings, logout } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleToggleSetting = (key: keyof typeof settings.notifications, value: boolean) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
    
    toast.success("Settings updated");
  };

  const handleToggleDarkMode = (value: boolean) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      darkMode: value
    });
    
    toast.info(value ? "Dark mode enabled" : "Dark mode disabled");
  };

  const handleToggleBackup = (value: boolean) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      dataBackup: value
    });
    
    toast.success(value ? "Backup enabled" : "Backup disabled");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl uppercase tracking-wider font-mono">Settings</h1>

      {/* Profile Section */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 wireframe-avatar">
              <AvatarImage src="" />
              <AvatarFallback className="font-mono">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium uppercase tracking-wide">{user?.name.toUpperCase()}</h3>
              <p className="text-sm text-muted-foreground font-mono">{user?.email}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="wireframe-button" 
              data-variant="outline"
              onClick={() => setShowEditProfile(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workout Goals */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
            <Target className="w-5 h-5" />
            Workout Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="uppercase tracking-wide">Weekly workout goal</Label>
              <p className="text-sm text-muted-foreground font-mono">Currently set to {user?.weeklyGoal} workouts</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="wireframe-button" 
              data-variant="outline"
              onClick={() => setShowEditProfile(true)}
            >
              Edit
            </Button>
          </div>
          <Separator className="wireframe-separator" />
          <div className="flex justify-between items-center">
            <div>
              <Label className="uppercase tracking-wide">Workout reminders</Label>
              <p className="text-sm text-muted-foreground font-mono">Daily at {settings?.reminderTime || '18:00'}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="wireframe-button" 
              data-variant="outline"
              onClick={() => toast.info("Reminder scheduling coming soon!")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="uppercase tracking-wide">Workout reminders</Label>
              <p className="text-sm text-muted-foreground font-mono">Get notified when it's time to work out</p>
            </div>
            <Switch 
              checked={settings?.notifications.workoutReminders} 
              onCheckedChange={(checked) => handleToggleSetting('workoutReminders', checked)}
              className="wireframe-switch" 
            />
          </div>
          <Separator className="wireframe-separator" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="uppercase tracking-wide">Achievement notifications</Label>
              <p className="text-sm text-muted-foreground font-mono">Celebrate your fitness milestones</p>
            </div>
            <Switch 
              checked={settings?.notifications.achievements}
              onCheckedChange={(checked) => handleToggleSetting('achievements', checked)}
              className="wireframe-switch" 
            />
          </div>
          <Separator className="wireframe-separator" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="uppercase tracking-wide">Daily tips</Label>
              <p className="text-sm text-muted-foreground font-mono">Receive daily motivation and tips</p>
            </div>
            <Switch 
              checked={settings?.notifications.dailyTips}
              onCheckedChange={(checked) => handleToggleSetting('dailyTips', checked)}
              className="wireframe-switch" 
            />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">App Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <Label className="uppercase tracking-wide">Dark mode</Label>
            </div>
            <Switch 
              checked={settings?.darkMode}
              onCheckedChange={handleToggleDarkMode}
              className="wireframe-switch" 
            />
          </div>
          <Separator className="wireframe-separator" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <Label className="uppercase tracking-wide">Data backup</Label>
            </div>
            <Switch 
              checked={settings?.dataBackup}
              onCheckedChange={handleToggleBackup}
              className="wireframe-switch" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="wireframe-card">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="ghost" 
            className="w-full justify-start wireframe-button" 
            data-variant="ghost"
            onClick={() => toast.info("Help & FAQ coming soon!")}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help & FAQ
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start wireframe-button" 
            data-variant="ghost"
            onClick={() => toast.info("Contact support: support@fitlog.app")}
          >
            <User className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="wireframe-card">
        <CardContent className="pt-6">
          <Button 
            variant="destructive" 
            className="w-full wireframe-button"
            onClick={() => {
              logout();
              toast.success("Signed out successfully");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <EditProfileDialog 
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  );
}