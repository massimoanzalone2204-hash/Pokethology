import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BattleProvider } from './context/BattleContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary onReset={() => window.location.reload()}>
      <BattleProvider>
        <App />
        <SpeedInsights />
      </BattleProvider>
    </ErrorBoundary>
  </StrictMode>,
);
