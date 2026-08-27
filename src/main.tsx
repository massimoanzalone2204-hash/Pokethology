import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BattleProvider } from './context/BattleContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n';
import MainApp from './MainApp.tsx';
import './index.css';
import { registerServiceWorker } from './utils/notificationManager';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary onReset={() => window.location.reload()}>
      <BattleProvider>
        <MainApp />
      </BattleProvider>
    </ErrorBoundary>
  </StrictMode>,
);
