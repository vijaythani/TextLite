var cacheName = 'textLite-ver1.0.1';
var filesToCache = [
    'main.js',

    '../index.html',

    '../styles/main.css',
    
    'service-worker.js',
    
    'network.js',

    '../images/firebase-logo.png',

    '../images/profile_placeholder.png',

    '/#'

];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});