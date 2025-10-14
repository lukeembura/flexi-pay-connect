import { useSettings } from '@/hooks/useSettings';

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private reminders: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  scheduleReminder(
    type: 'mood' | 'journal' | 'breathing',
    hour: number,
    minute: number = 0
  ) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      this.sendReminder(type);
      // Reschedule for the next day
      this.scheduleReminder(type, hour, minute);
    }, timeUntilReminder);

    // Clear any existing reminder of this type
    const existingTimeout = this.reminders.get(type);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    this.reminders.set(type, timeoutId);
  }

  private sendReminder(type: 'mood' | 'journal' | 'breathing') {
    if (Notification.permission !== 'granted') return;

    const messages = {
      mood: {
        title: 'Daily Mood Check-in',
        body: 'How are you feeling today? Take a moment to check in with yourself.'
      },
      journal: {
        title: 'Journal Reminder',
        body: 'Time to reflect and write in your journal. What\'s on your mind?'
      },
      breathing: {
        title: 'Breathing Break',
        body: 'Take a moment to breathe deeply and center yourself.'
      }
    };

    const message = messages[type];
    new Notification(message.title, {
      body: message.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: type,
      requireInteraction: false
    });
  }

  cancelReminder(type: 'mood' | 'journal' | 'breathing') {
    const timeoutId = this.reminders.get(type);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.reminders.delete(type);
    }
  }

  setupReminders(settings: any) {
    // Cancel all existing reminders
    this.cancelAllReminders();

    if (!settings.notificationsEnabled) return;

    // Schedule reminders based on settings
    if (settings.moodReminders) {
      this.scheduleReminder('mood', 10, 0); // 10:00 AM
    }

    if (settings.journalReminders) {
      this.scheduleReminder('journal', 20, 0); // 8:00 PM
    }

    if (settings.breathingReminders) {
      // Schedule multiple breathing reminders throughout the day
      this.scheduleReminder('breathing', 14, 0); // 2:00 PM
    }
  }

  private cancelAllReminders() {
    this.reminders.forEach((timeoutId) => clearTimeout(timeoutId));
    this.reminders.clear();
  }
}

export const notificationScheduler = NotificationScheduler.getInstance();