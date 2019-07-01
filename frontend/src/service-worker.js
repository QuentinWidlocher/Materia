// custom service-worker.js
if (workbox) {
    // adjust log level for displaying workbox logs
    workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)
    workbox.precaching.precacheAndRoute(self.__precacheManifest);
}