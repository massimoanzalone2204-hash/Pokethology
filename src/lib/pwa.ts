// PWA Utilities for Pokéthology Universal Client

let deferredPrompt: any = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

export function isPwaInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  if (isStandalone) return false;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (isIOS) return true;
  
  return deferredPrompt !== null;
}

export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'unsupported'> {
  if (!deferredPrompt) {
    return 'unsupported';
  }
  try {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choiceResult.outcome;
  } catch (err) {
    console.error('PWA install prompt error:', err);
    return 'dismissed';
  }
}

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermissionState(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'default';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch (err) {
    console.error('Notification permission error:', err);
    return 'denied';
  }
}

export function sendDiscoveryNotifications() {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('Pokéthology Neural Terminal', {
        body: 'Universal combat sync and daily battle notifications enabled!',
        icon: '/icon.png'
      });
      
      // Schedule more notifications during the day
      const dailyNotifications = [
        {
          title: '🤖 Universal AI Chatbot Discovery',
          body: 'Ask the AI Chatbot anything! Explore Pokémon lore, battle tactics, game mechanics, anime, or any topic you like!',
          delay: 5000,
        },
        {
          title: '⚔️ Combat Simulator Discovery',
          body: 'Test your Pokémon team in real-time turn-based tactical combat with damage calculations!',
          delay: 20000,
        },
        {
          title: '🌟 Pokéthology World Exploration',
          body: 'Explore over 1,000+ Pokémon, evolutions, abilities & competitive movesets offline!',
          delay: 45000,
        },
        {
          title: '🏆 Daily Challenge',
          body: 'Have you scanned your daily Pokémon? Complete your Pokédex and claim your rewards!',
          delay: 3600000, // 1 hour
        },
        {
          title: '🧠 Theological Exam Reminder',
          body: 'Sharpen your knowledge! Take the Pokéthology Exam to test your mastery.',
          delay: 7200000, // 2 hours
        },
        {
          title: '⚔️ Arena Awaits',
          body: 'Your rivals are waiting in the Arena. Jump in and battle now!',
          delay: 14400000, // 4 hours
        },
        {
          title: '📚 Lore Master',
          body: 'Discover the deep lore of legendary Pokémon and mythical regions in the Pokédex.',
          delay: 28800000, // 8 hours
        }
      ];

      dailyNotifications.forEach(({ title, body, delay }) => {
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/icon.png' });
          }
        }, delay);
      });
      
      // Set an interval for generic hourly reminders
      setInterval(() => {
        if (Notification.permission === 'granted') {
           new Notification('Pokéthology Hourly Sync', {
             body: 'Trainers are waiting! Check the Arena and your daily Pokémon scans.',
             icon: '/icon.png'
           });
        }
      }, 3600000); // every 1 hour

    } catch (_) {}
  }
}
