import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Palette, Volume2, Bell, Moon, Sun } from "lucide-react";

interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CustomizationSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'lavender' | 'sage' | 'blush' | 'ocean';
  soundEnabled: boolean;
  backgroundSounds: boolean;
  notificationsEnabled: boolean;
  moodReminders: boolean;
  journalReminders: boolean;
  breathingReminders: boolean;
}

const colorSchemes = {
  lavender: { name: 'Soft Lavender', primary: '#8B5CF6', secondary: '#E9D5FF' },
  sage: { name: 'Sage Green', primary: '#10B981', secondary: '#D1FAE5' },
  blush: { name: 'Blush Pink', primary: '#F472B6', secondary: '#FCE7F3' },
  ocean: { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#DBEAFE' }
};

export function CustomizationModal({ open, onOpenChange }: CustomizationModalProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CustomizationSettings>({
    theme: 'system',
    colorScheme: 'lavender',
    soundEnabled: true,
    backgroundSounds: false,
    notificationsEnabled: true,
    moodReminders: true,
    journalReminders: true,
    breathingReminders: false
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('sereniYou-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem('sereniYou-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your customization preferences have been saved.",
    });
    onOpenChange(false);
  };

  const updateSetting = <K extends keyof CustomizationSettings>(
    key: K, 
    value: CustomizationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
                    onClick={() => updateSetting('theme', 'light')}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('theme', 'dark')}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('theme', 'system')}
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
                      onClick={() => updateSetting('colorScheme', key as any)}
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
                <Switch
                  id="sound-enabled"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                />
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
                  onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
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