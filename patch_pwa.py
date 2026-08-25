import re

with open('src/lib/pwa.ts', 'r') as f:
    text = f.read()

old_func = """export function isPwaInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  return !isStandalone && (deferredPrompt !== null || /iPad|iPhone|iPod|Android/.test(navigator.userAgent));
}"""

new_func = """export function isPwaInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  if (isStandalone) return false;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  if (isIOS) return true;
  
  return deferredPrompt !== null;
}"""

if old_func in text:
    text = text.replace(old_func, new_func)
    with open('src/lib/pwa.ts', 'w') as f:
        f.write(text)
    print("Patched pwa.ts")
else:
    print("Could not find func in pwa.ts")

