import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

old_func = """  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const handleInstallPWA = async () => {
    setIsPwaModalOpen(true);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    }
  };"""

new_func = """  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const handleInstallPWA = () => {
    setIsPwaModalOpen(true);
  };"""

text = text.replace(old_func, new_func)

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("App patched")
