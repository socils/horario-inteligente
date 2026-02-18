/* ==========================================
   HORARIO INTELIGENTE - SERVICE WORKER
   Funcionalidad Offline para PWA
   ========================================== */

const CACHE_NAME = 'horario-inteligente-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

// ===== INSTALACIÓN DEL SERVICE WORKER =====
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // Fuerza la activación inmediata
                return self.skipWaiting();
            })
            .catch((error) => {
                console.log('Error al cachear:', error);
            })
    );
});

// ===== ACTIVACIÓN DEL SERVICE WORKER =====
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Eliminar versiones antiguas del cache
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Reclama todos los clientes
            return self.clients.claim();
        })
    );
});

// ===== ESTRATEGIA DE FETCH: CACHE FIRST, FALLBACK TO NETWORK =====
self.addEventListener('fetch', (event) => {
    // Solo cachear requests GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        // Primero intenta obtener del cache
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, retorna la respuesta cacheada
                if (response) {
                    return response;
                }

                // Si no está en cache, intenta obtenerlo de la red
                return fetch(event.request)
                    .then((response) => {
                        // Valida que la respuesta sea válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clona la respuesta
                        const responseToCache = response.clone();

                        // Cachea esta nueva respuesta
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Si falla la red y no está en cache, retorna index.html (offline page)
                        return caches.match('./index.html');
                    });
            })
    );
});

// ===== BACKGROUND SYNC (SINCRONIZACIÓN EN BACKGROUND) =====
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // Sincronizar datos cuando vuelva la conexión
            syncData()
        );
    }
});

async function syncData() {
    try {
        console.log('Service Worker: Sincronizando datos...');
        // Los datos se guardan en LocalStorage, así que no hay nada que hacer aquí
        // pero está implementado para futuras mejoras
    } catch (error) {
        console.log('Error sincronizando:', error);
        throw error;
    }
}

// ===== PUSH NOTIFICATIONS (OPCIONAL PARA FUTURO) =====
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const options = {
        body: event.data.text(),
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23302b63"/><stop offset="100%" style="stop-color:%238e44ad"/></linearGradient></defs><rect width="192" height="192" fill="url(%23grad)"/><text x="96" y="110" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">H</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23302b63"/><stop offset="100%" style="stop-color:%238e44ad"/></linearGradient></defs><rect width="192" height="192" fill="url(%23grad)"/></svg>'
    };

    event.waitUntil(
        self.registration.showNotification('Horario Inteligente', options)
    );
});

// ===== MANEJO DE NOTIFICACIONES =====
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // Si hay una ventana abierta, enfócala
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].url === '/' && 'focus' in clientList[i]) {
                        return clientList[i].focus();
                    }
                }
                // Si no hay ventana, abre una nueva
                if (clients.openWindow) {
                    return clients.openWindow('./');
                }
            })
    );
});

console.log('Service Worker cargado y listo');
