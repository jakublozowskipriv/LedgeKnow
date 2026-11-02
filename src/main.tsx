import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource/space-mono/400.css';
import './styles.css';
import { App } from './app';

render(<App />, document.getElementById('app')!);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW({ immediate: true });
  // Prosimy przeglądarkę, żeby nie czyściła lokalnego postępu.
  navigator.storage?.persist?.().catch(() => undefined);
}
