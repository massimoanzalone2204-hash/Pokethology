// Notification & PWA Manager for Pokéthology World

export interface PokethologyNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('Pokéthology Service Worker registered successfully:', reg.scope);
    return reg;
  } catch (error) {
    console.warn('Service Worker registration failed or unsupported in this context:', error);
    return null;
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendDiscoveryNotifications();
    }
    return permission;
  } catch (e) {
    console.warn('Notification permission error:', e);
    return 'denied';
  }
};

export const sendPokethologyNotification = async ({
  title,
  body,
  icon = '/logo.png',
  tag = 'pokethology-discovery',
}: PokethologyNotificationOptions): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Try ServiceWorker notification first
  if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon,
          badge: icon,
          tag,
          vibrate: [80, 40, 80],
          data: { url: '/' },
        } as any);
        return true;
      }
    } catch (_) {}

    try {
      new Notification(title, { body, icon, tag });
      return true;
    } catch (_) {}
  }
  return false;
};

// Scheduled discovery notifications promoting Chatbot, Combat, and Pokéthology features
export const sendDiscoveryNotifications = () => {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const notifications = [
    {
      title: '🤖 Universal AI Chatbot Discovery',
      body: 'Ask the AI Chatbot anything! Explore Pokémon lore, battle tactics, game mechanics, anime, or any topic you like!',
      tag: 'chatbot-discovery',
      delay: 5000,
    },
    {
      title: '⚔️ Combat Simulator Discovery',
      body: 'Test your Pokémon team in real-time turn-based tactical combat with damage calculations!',
      tag: 'combat-discovery',
      delay: 20000,
    },
    {
      title: '🌟 Pokéthology World Exploration',
      body: 'Explore over 1,000+ Pokémon, evolutions, abilities & competitive movesets offline!',
      tag: 'app-discovery',
      delay: 45000,
    },
    {
      title: '🏆 Daily Challenge',
      body: 'Have you scanned your daily Pokémon? Complete your Pokédex and claim your rewards!',
      tag: 'daily-challenge',
      delay: 3600000, // 1 hour
    },
    {
      title: '🧠 Theological Exam Reminder',
      body: 'Sharpen your knowledge! Take the Pokéthology Exam to test your mastery.',
      tag: 'exam-discovery',
      delay: 7200000, // 2 hours
    },
    {
      title: '⚔️ Arena Awaits',
      body: 'Your rivals are waiting in the Arena. Jump in and battle now!',
      tag: 'arena-reminder',
      delay: 14400000, // 4 hours
    },
    {
      title: '📚 Lore Master',
      body: 'Discover the deep lore of legendary Pokémon and mythical regions in the Pokédex.',
      tag: 'lore-reminder',
      delay: 28800000, // 8 hours
    }
  ];

  notifications.forEach(({ title, body, tag, delay }) => {
    setTimeout(() => {
      sendPokethologyNotification({ title, body, tag });
    }, delay);
  });
  
  // Generic Hourly Reminders
  setInterval(() => {
    sendPokethologyNotification({
      title: 'Pokéthology Hourly Sync',
      body: 'Trainers are waiting! Check the Arena and your daily Pokémon scans.',
      tag: 'hourly-sync'
    });
  }, 3600000);
};
