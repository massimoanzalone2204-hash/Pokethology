// Notification & PWA Manager for Pokéthology World
// Handles native device notifications (Service Worker & Notification API)

export interface PokethologyNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  actions?: Array<{ action: string; title: string }>;
  data?: Record<string, any>;
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
      scheduleDeviceActivityNotifications();
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
  icon = '/icon.svg',
  tag = 'pokethology-activity',
  actions,
  data = { url: '/' },
}: PokethologyNotificationOptions): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Try ServiceWorker device notification first
  if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon,
          badge: icon,
          tag,
          vibrate: [100, 50, 100],
          data,
          actions: actions || [{ action: 'open', title: 'Open Pokéthology' }],
        } as NotificationOptions & { vibrate?: number[] });
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

// Activity-based device notifications that inform users of all capabilities available on their device
export const ACTIVITY_DEVICE_NOTIFICATIONS = [
  {
    id: 'daily-hub-missions',
    title: '🎯 Daily Operations Hub Active',
    body: 'New Bronze, Silver, & Gold tactical challenges and lore exams are ready! Test your tactical prowess and advance your Operator Rank.',
    tag: 'daily-missions-activity',
    delay: 5000,
  },
  {
    id: 'combat-arena',
    title: '⚔️ Tactical Combat Arena Open',
    body: 'Engage in turn-based battles against Elite AI trainers, calculate super-effective moves, and climb the battle tier rankings!',
    tag: 'combat-arena-activity',
    delay: 25000,
  },
  {
    id: 'ai-strategist',
    title: '🧠 Pokéthology AI Strategist Ready',
    body: 'Need help crafting competitive teams or understanding hidden abilities? Chat with your dedicated AI Pokédex Strategist anytime!',
    tag: 'ai-strategist-activity',
    delay: 55000,
  },
  {
    id: 'pokedex-radar',
    title: '📡 Radar Scanner & Pokédex Explorer',
    body: 'Explore over 1,000+ Pokémon with authentic base stats, shiny forms, 3D home sprites, and complete evolutionary trees!',
    tag: 'radar-scanner-activity',
    delay: 90000,
  },
  {
    id: 'comparative-analyzer',
    title: '⚖️ Head-to-Head Species Analyzer',
    body: 'Compare Pokémon stats side-by-side, analyze defensive type matrices, and calculate offensive coverage matchups.',
    tag: 'comparison-activity',
    delay: 140000,
  },
  {
    id: 'move-lab',
    title: '🧪 Competitive Move Lab & Damage Calc',
    body: 'Deep dive into 900+ signature moves, accuracy ratings, priority tiers, secondary effects, and status triggers.',
    tag: 'move-lab-activity',
    delay: 200000,
  },
  {
    id: 'offline-vault',
    title: '💾 Full Offline Mode Available',
    body: 'Pokéthology works offline! Your Dex database and battle mechanics remain playable even without an internet connection.',
    tag: 'offline-vault-activity',
    delay: 280000,
  },
  {
    id: 'daily-reset-reminder',
    title: '⏳ Daily Division Midnight Reset',
    body: 'Complete today’s remaining daily operations to maintain your training momentum before operations rotate at midnight!',
    tag: 'daily-reset-activity',
    delay: 360000,
  },
];

// Scheduled activity-based device notifications
export const sendDiscoveryNotifications = () => {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  ACTIVITY_DEVICE_NOTIFICATIONS.forEach(({ title, body, tag, delay }) => {
    setTimeout(() => {
      sendPokethologyNotification({ title, body, tag });
    }, delay);
  });
};

// Periodic device notifications for installed PWA / standalone devices
export const scheduleDeviceActivityNotifications = () => {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Periodic interval checks (e.g. every 4 hours or when active)
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  if (!isInstalled) return;

  const now = Date.now();
  const lastCheck = Number(localStorage.getItem('pokethology_last_device_notification') || '0');
  
  // If at least 3 hours since last notification, trigger a relevant activity notification
  if (now - lastCheck > 3 * 60 * 60 * 1000) {
    const randomActivity = ACTIVITY_DEVICE_NOTIFICATIONS[Math.floor(Math.random() * ACTIVITY_DEVICE_NOTIFICATIONS.length)];
    sendPokethologyNotification({
      title: randomActivity.title,
      body: randomActivity.body,
      tag: randomActivity.tag,
    });
    localStorage.setItem('pokethology_last_device_notification', String(now));
  }
};

