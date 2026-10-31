const CACHE="kiadasok-v1";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Hálózat először (mindig a legfrissebb verzió), internet nélkül a mentett másolat.
// Az auth.json és a külső (GitHub API) kérések sosem mennek át a gyorsítótáron.
self.addEventListener("fetch",e=>{
const r=e.request,u=new URL(r.url);
if(r.method!=="GET"||u.origin!==location.origin||u.pathname.endsWith("/auth.json"))return;
e.respondWith(fetch(r.mode==="navigate"?r.url:r,{cache:"no-cache"}).then(res=>{
if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.mode==="navigate"?r.url:r,cp))}
return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("index.html"))))});
