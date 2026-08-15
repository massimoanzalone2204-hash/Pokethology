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
  return !isStandalone && (deferredPrompt !== null || /iPad|iPhone|iPod|Android/.test(navigator.userAgent));
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
        icon: '/icon.svg'
      });
    } catch (_) {}
  }
}
