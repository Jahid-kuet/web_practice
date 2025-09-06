// Modern Service Worker for Admin Panel PWA
const CACHE_NAME = 'admin-panel-v1.0.0';
const STATIC_CACHE_NAME = 'admin-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'admin-dynamic-v1.0.0';

// Files to cache
const STATIC_FILES = [
  '/admin.html',
  '/admin.css',
  '/admin.js',
  '/manifest.json',
  '/img/logo.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('❌ Failed to cache static files:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME &&
                     cacheName.startsWith('admin-');
            })
            .map(cacheName => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
      .catch(err => {
        console.error('❌ Service Worker activation failed:', err);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML documents - Network first, cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (url.origin === location.origin) {
    // Same origin requests - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // External resources - Stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Network first strategy (for HTML)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('📱 Network failed, serving from cache:', request.url);
    return caches.match(request);
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('💾 Serving from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    console.log('🌐 Fetched from network and cached:', request.url);
    return networkResponse;
  } catch (error) {
    console.error('❌ Failed to fetch:', request.url, error);
    throw error;
  }
}

// Stale while revalidate strategy (for external resources)
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  const networkResponsePromise = fetch(request);
  
  if (cachedResponse) {
    console.log('💾 Serving stale from cache:', request.url);
    
    // Update cache in background
    networkResponsePromise
      .then(networkResponse => {
        const cache = caches.open(DYNAMIC_CACHE_NAME);
        cache.then(c => c.put(request, networkResponse.clone()));
      })
      .catch(err => console.log('Background update failed:', err));
    
    return cachedResponse;
  }
  
  console.log('🌐 No cache, fetching from network:', request.url);
  return networkResponsePromise;
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'admin-data-sync') {
    event.waitUntil(syncAdminData());
  }
});

async function syncAdminData() {
  try {
    // Get pending data from IndexedDB
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      console.log('📤 Syncing pending data:', pendingData.length, 'items');
      
      for (const data of pendingData) {
        try {
          await fetch(data.url, {
            method: data.method,
            headers: data.headers,
            body: data.body
          });
          
          // Remove from pending list
          await removePendingData(data.id);
        } catch (error) {
          console.error('❌ Failed to sync item:', data.id, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Helper functions for IndexedDB (simplified)
async function getPendingData() {
  // In a real implementation, this would use IndexedDB
  return [];
}

async function removePendingData(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending data:', id);
}

// Push notification handler
self.addEventListener('push', event => {
  console.log('📬 Push notification received');
  
  const data = event.data ? event.data.json() : {};
  
  const options = {
    title: data.title || 'Admin Panel Notification',
    body: data.body || 'You have a new notification',
    icon: '/img/logo.png',
    badge: '/img/logo.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/admin.html'
    },
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/img/logo.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('📱 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/admin.html';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          // Check if admin panel is already open
          for (const client of clientList) {
            if (client.url.includes('admin.html') && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// Error handler
self.addEventListener('error', event => {
  console.error('❌ Service Worker error:', event.error);
});

// Update available notification
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Skipping waiting...');
    self.skipWaiting();
  }
});

console.log('🔧 Service Worker loaded successfully');
