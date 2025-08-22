import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CustomizationSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'lavender' | 'sage' | 'blush' | 'ocean';
  soundEnabled: boolean;
  backgroundSounds: boolean;
  notificationsEnabled: boolean;
  moodReminders: boolean;
  journalReminders: boolean;
  breathingReminders: boolean;
}

const defaultSettings: CustomizationSettings = {
  theme: 'system',
  colorScheme: 'lavender',
  soundEnabled: true,
  backgroundSounds: false,
  notificationsEnabled: true,
  moodReminders: true,
  journalReminders: true,
  breathingReminders: false
};

const colorSchemes = {
  lavender: {
    primary: '260 60% 65%',
    'primary-glow': '260 70% 75%',
    secondary: '260 30% 85%',
    accent: '280 35% 85%'
  },
  sage: {
    primary: '120 25% 65%',
    'primary-glow': '120 35% 75%',
    secondary: '120 20% 85%',
    accent: '140 35% 85%'
  },
  blush: {
    primary: '340 60% 70%',
    'primary-glow': '340 70% 80%',
    secondary: '340 30% 90%',
    accent: '320 35% 85%'
  },
  ocean: {
    primary: '200 60% 65%',
    'primary-glow': '200 70% 75%',
    secondary: '200 30% 85%',
    accent: '220 35% 85%'
  }
};

interface SettingsContextType {
  settings: CustomizationSettings;
  updateSetting: <K extends keyof CustomizationSettings>(key: K, value: CustomizationSettings[K]) => void;
  playSound: (soundType: 'click' | 'success' | 'notification') => void;
  requestNotificationPermission: () => Promise<boolean>;
  sendNotification: (title: string, body: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CustomizationSettings>(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('sereniYou-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    } else {
      applySettings(defaultSettings);
    }
  }, []);

  const applySettings = (newSettings: CustomizationSettings) => {
    // Apply theme
    applyTheme(newSettings.theme);
    
    // Apply color scheme
    applyColorScheme(newSettings.colorScheme);
    
    // Request notification permission if enabled
    if (newSettings.notificationsEnabled) {
      requestNotificationPermission();
    }
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  const applyColorScheme = (scheme: keyof typeof colorSchemes) => {
    const root = document.documentElement;
    const colors = colorSchemes[scheme];
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const updateSetting = <K extends keyof CustomizationSettings>(
    key: K,
    value: CustomizationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('sereniYou-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const playSound = (soundType: 'click' | 'success' | 'notification') => {
    if (!settings.soundEnabled) return;
    
    // Create audio context for Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sound types
      const frequencies = {
        click: 800,
        success: [523, 659, 784], // C-E-G chord
        notification: 1000
      };
      
      if (Array.isArray(frequencies[soundType])) {
        // Play chord for success
        frequencies[soundType].forEach((freq, index) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.3);
          }, index * 100);
        });
      } else {
        oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  const sendNotification = (title: string, body: string) => {
    if (!settings.notificationsEnabled || Notification.permission !== 'granted') {
      return;
    }

    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      playSound,
      requestNotificationPermission,
      sendNotification
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}