/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Treści: zawsze próbujemy pobrać najnowsze, offline – wersja z cache.
registerRoute(
  ({ url }) => url.pathname.endsWith('/data/cards.json'),
  new NetworkFirst({ cacheName: 'ledgeknow-cards', networkTimeoutSeconds: 5 }),
);

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
}

self.addEventListener('push', (event) => {
  let data: PushPayload = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { body: event.data?.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'LedgeKnow', {
      body: data.body ?? 'Czeka na Ciebie nowa porcja wiedzy.',
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      tag: data.tag ?? 'ledgeknow',
      data: { url: data.url ?? './' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url ?? './', self.registration.scope).href;
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of all) {
        if ('focus' in client) {
          await (client as WindowClient).navigate(target).catch(() => undefined);
          return (client as WindowClient).focus();
        }
      }
      return self.clients.openWindow(target);
    })(),
  );
});
