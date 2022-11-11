// Cached core static resources 
self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("static2").then(cache=>{
      return cache.addAll(["./",'./images/logo192.png']);
    })
  );
});

// Fetch resources
self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(response=>{
      return response||fetch(e.request);
    })
  );
});

// On activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName === "static";
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});