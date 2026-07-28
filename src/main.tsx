import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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
      </BattleProvider>
    </ErrorBoundary>
  </StrictMode>,
);
