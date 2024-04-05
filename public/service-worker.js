// Dans votre fichier service-worker.js

console.log('Service Worker Loaded');

// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', function(event) {
    console.log('Push Received', event  );

    const payload = event.data ? event.data.json() : null; // Vérifiez si event.data est défini avant d'appeler json()
    if (!payload) {
        console.error('No payload received.'); // Gérez le cas où aucune donnée n'est reçue avec la notification

        // eslint-disable-next-line no-restricted-globals
        self.registration.showNotification('Club Bouliste Saint Couatais', {
            body: 'Vous avez reçu une notification.',
            icon: 'https://cbsc-app.doryanbessiere.fr/logo192.png',
            data: { url: 'https://cbsc-app.doryanbessiere.fr/' }
        });
        return;
    }

    const title = payload.title;
    const body = payload.body;
    // const action = payload.action;

    event.waitUntil(
        // eslint-disable-next-line no-restricted-globals
        self.registration.showNotification(title, {
            body: body,
            icon: 'https://cbsc-app.doryanbessiere.fr/logo192.png',
            data: { url: 'https://cbsc-app.doryanbessiere.fr/' }
        })
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data.url;
    event.waitUntil(
        // eslint-disable-next-line no-restricted-globals
        self.openWindow(url)
    );
});
