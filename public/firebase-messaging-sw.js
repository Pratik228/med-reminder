// Placeholder service worker to avoid 404s from legacy Firebase messaging requests
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);
self.addEventListener("push", () => {});
