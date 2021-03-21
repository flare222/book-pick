// Give your cache a name
const cacheName = 'tys2'

// List all the file paths that you want to be available offline
const cachedFiles = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/main.css',
  '/styles/normalize.css',
  '/manifest.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/browserconfig.xml',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/mstile-70x70.png',
  '/mstile-144x144.png',
  '/mstile-150x150.png',
  '/mstile-310x310.png',
  '/safari-pinned-tab.svg',
  '/assets/background.jpeg',
  'https://fonts.gstatic.com/s/dosis/v18/HhyJU5sn9vOmLxNkIwRSjTVNWLEJBbMl2xMCbKsUPqjm.woff'
]

// Listen for the install event
self.addEventListener('install', function(e) {
  console.log('SW Install Event')
  // Add files to cache
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('Caching Files')
      return cache.addAll(cachedFiles)
    }).then(function() {
      // It will make the new service worker the active one and will not wait for the old one to handle all the fetches
      return self.skipWaiting()
    }).catch(function(error) {
      console.log('Cache Failed', error)
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('SW Activated')
  // Remove any caches that were created with previous versions of the SW
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) {
          console.log('Removing Old Cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

// Serve up cached files without a network connection, the SW fetch method will be overidden
self.addEventListener('fetch', function(e) {
  // console.log('Fetch Event Occurred', e.request.url)
  console.log('Fetch Event Occurred', e.request.url)

  e.respondWith(
    caches.match(e.request).then(function(response) {
      // return either the cached page (response), or call fetch on the original url
      return fetch(e.request) || response 
    })
  )
})
