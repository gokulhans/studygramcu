// self.addEventListener("install", e => {
//     e.waitUntil(
//         caches.open("static").then(cache => {
//             return cache.addAll([ "./","../views/index.hbs", "./src/master.css", "./images/logo.png" ])
//         })
//     )
// });

// self.addEventListener("fetch", e => {
//     e.respondWith(
//         caches.match(e.request).then(response => {
//             return response || fetch(e.request)
//         })
//     )
// })