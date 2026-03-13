/* =========================================
   SERVICE WORKER
   Villa Gourmet • Churrascada
   ========================================= */

const CACHE_NAME = "mercatto-pwa-v1";

/* arquivos essenciais do app */
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

/* =========================================
   INSTALAÇÃO
========================================= */

self.addEventListener("install", event => {

  console.log("Service Worker instalado");

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
  );

  self.skipWaiting();

});

/* =========================================
   ATIVAÇÃO
========================================= */

self.addEventListener("activate", event => {

  console.log("Service Worker ativo");

  event.waitUntil(

    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })

  );

  self.clients.claim();

});

/* =========================================
   FETCH (REQUISIÇÕES)
========================================= */

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(response => {

      /* se estiver no cache */
      if (response) {
        return response;
      }

      /* senão busca na internet */
      return fetch(event.request).catch(() => {

        /* fallback para index */
        return caches.match("./index.html");

      });

    })

  );

});
