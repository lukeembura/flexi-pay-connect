import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { Palette, Volume2, Bell, Moon, Sun, TestTube } from "lucide-react";

interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorSchemes = {
  lavender: { name: 'Soft Lavender', primary: 'hsl(260, 60%, 65%)', secondary: 'hsl(260, 30%, 85%)' },
  sage: { name: 'Sage Green', primary: 'hsl(120, 25%, 65%)', secondary: 'hsl(120, 20%, 85%)' },
  blush: { name: 'Blush Pink', primary: 'hsl(340, 60%, 70%)', secondary: 'hsl(340, 30%, 90%)' },
  ocean: { name: 'Ocean Blue', primary: 'hsl(200, 60%, 65%)', secondary: 'hsl(200, 30%, 85%)' }
};

export function CustomizationModal({ open, onOpenChange }: CustomizationModalProps) {
  const { toast } = useToast();
  const { settings, updateSetting, playSound, requestNotificationPermission } = useSettings();

  const handleSave = () => {
    playSound('success');
    toast({
      title: "Settings Saved",
      description: "Your customization preferences have been applied.",
    });
    onOpenChange(false);
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
        return;
      }
    }
    updateSetting('notificationsEnabled', checked);
  };

  const testSound = (soundType: 'click' | 'success' | 'notification') => {
    playSound(soundType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            Customize Your Space
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      playSound('click');
                      updateSetting('theme', 'light');
                    }}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      playSound('click');
                      updateSetting('theme', 'dark');
                    }}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      playSound('click');
                      updateSetting('theme', 'system');
                    }}
                  >
                    System
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Color Scheme</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(colorSchemes).map(([key, scheme]) => (
                    <Button
                      key={key}
                      variant={settings.colorScheme === key ? 'default' : 'outline'}
                      onClick={() => {
                        playSound('click');
                        updateSetting('colorScheme', key as any);
                      }}
                      className="justify-start"
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: scheme.primary }}
                      />
                      {scheme.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Sound Settings */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Sounds</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-enabled">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Play sounds for interactions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSound('click')}
                    className="text-xs"
                  >
                    <TestTube className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Switch
                    id="sound-enabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="background-sounds">Background Sounds</Label>
                  <p className="text-sm text-muted-foreground">Gentle ambient sounds during exercises</p>
                </div>
                <Switch
                  id="background-sounds"
                  checked={settings.backgroundSounds}
                  onCheckedChange={(checked) => updateSetting('backgroundSounds', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Notifications & Reminders</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Allow browser notifications</p>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
              
              {settings.notificationsEnabled && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mood-reminders">Daily Mood Check-in</Label>
                      <p className="text-sm text-muted-foreground">Remind me to track my mood</p>
                    </div>
                    <Switch
                      id="mood-reminders"
                      checked={settings.moodReminders}
                      onCheckedChange={(checked) => updateSetting('moodReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="journal-reminders">Journal Reminders</Label>
                      <p className="text-sm text-muted-foreground">Remind me to write in my journal</p>
                    </div>
                    <Switch
                      id="journal-reminders"
                      checked={settings.journalReminders}
                      onCheckedChange={(checked) => updateSetting('journalReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="breathing-reminders">Breathing Exercise Reminders</Label>
                      <p className="text-sm text-muted-foreground">Remind me to take breathing breaks</p>
                    </div>
                    <Switch
                      id="breathing-reminders"
                      checked={settings.breathingReminders}
                      onCheckedChange={(checked) => updateSetting('breathingReminders', checked)}
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}