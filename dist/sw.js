const CACHE_NAME = 'daliltounes-v1.0.0';
const STATIC_CACHE = 'daliltounes-static-v1.0.0';
const DYNAMIC_CACHE = 'daliltounes-dynamic-v1.0.0';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Ajoutez d'autres ressources statiques importantes
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_ASSETS = [
  '/src/main.tsx',
  '/src/App.tsx',
  // Les images seront mises en cache dynamiquement
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégie Cache First pour les ressources statiques
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.includes('/icons/')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request);
        })
    );
    return;
  }

  // Stratégie Network First pour les API et données dynamiques
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cloner la réponse car elle ne peut être consommée qu'une fois
          const responseClone = response.clone();
          
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Fallback vers le cache si le réseau échoue
          return caches.match(request);
        })
    );
    return;
  }

  // Stratégie Stale While Revalidate pour les images
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              const fetchPromise = fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                });

              return cachedResponse || fetchPromise;
            });
        })
    );
    return;
  }

  // Stratégie par défaut : Network First avec fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback pour les pages HTML
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            // Fallback générique
            return new Response('Contenu non disponible hors ligne', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification de daliltounes',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorer',
        icon: '/icons/explore-action.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/close-action.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('daliltounes', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Ne rien faire, juste fermer
  } else {
    // Clic sur la notification principale
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Ici vous pouvez synchroniser les données en arrière-plan
      console.log('Synchronisation des données...')
    );
  }
});

// Gestion des mises à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});