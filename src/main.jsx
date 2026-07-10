import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { initializeLiveUpdates } from './lib/liveUpdates.js'

initializeLiveUpdates('PeptidAI');

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.warn('Unhandled error:', event.message);
});

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  console.error('Fatal render error:', e);
  document.getElementById('root').innerHTML = '<div style="padding:40px;text-align:center;font-family:system-ui"><h1>Something went wrong</h1><p>Please restart the app. If the problem persists, reinstall PeptidAI.</p><pre style="margin-top:20px;font-size:12px;color:#999">' + e.message + '</pre></div>';
}
