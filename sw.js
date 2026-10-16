const VERSION='0.2.0';
const BASE=new URL('./',self.location.href);
const PREFIX='jarvis-os:'+BASE.pathname+':';
const CACHE=PREFIX+VERSION;
const FILES=['./','index.html','style.css','app.js','core.js','db.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 if(req.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL('index.html',BASE).href)||fetch(req);})());return;}
 if(!FILES.includes(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached)return cached;const response=await fetch(req);if(response.ok)await cache.put(req,response.clone());return response;})());
});
