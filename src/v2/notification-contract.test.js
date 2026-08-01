import fs from 'fs';
import path from 'path';

const srcRoot = path.resolve(__dirname, '..');
const v2Root = path.resolve(__dirname);

const read = (...parts) => {
    return fs.readFileSync(path.join(...parts), 'utf8');
};

describe('V2 notification inbox and Web Push contract', () => {
    it('uses the backend notification GraphQL contract', () => {
        const apiSource = read(srcRoot, 'features', 'notifications.js');

        expect(apiSource).toContain('getNotifications(limit: $limit)');
        expect(apiSource).toContain('currentPrice');
        expect(apiSource).toContain('unreadNotificationCount');
        expect(apiSource).toContain('markNotificationRead(id: $id)');
        expect(apiSource).toContain('markAllNotificationsRead');
        expect(apiSource).toContain('webPushPublicKey');
        expect(apiSource).toContain('savePushSubscription(endpoint: $endpoint, p256dh: $p256dh, auth: $auth)');
        expect(apiSource).toContain('removePushSubscription(endpoint: $endpoint)');
        expect(apiSource).toContain('payload.errors');
    });

    it('keeps notification access authenticated with the Auth0 v2 options shape', () => {
        const bellSource = read(v2Root, 'design-system', 'NotificationBell.js');
        const inboxSource = read(v2Root, 'pages', 'Notifications.js');
        const settingsSource = read(v2Root, 'design-system', 'NotificationSettings.js');

        [ bellSource, inboxSource, settingsSource ].forEach((source) => {
            expect(source).toContain('authorizationParams: AUTH_OPTIONS');
        });
    });

    it('adds an icon-only bell to the authenticated header and keeps notifications in V2', () => {
        const appSource = read(srcRoot, 'App.js');
        const accountSource = read(v2Root, 'design-system', 'AccountActions.js');
        const bellSource = read(v2Root, 'design-system', 'NotificationBell.js');

        expect(accountSource).toContain('<NotificationBell />');
        expect(bellSource).toContain("aria-label = 'Notiser'");
        expect(bellSource).toContain("to = '/notifications'");
        expect(appSource).toContain("path = '/notifications'");
        expect(appSource).toContain('<V2Notifications />');
    });

    it('provides Swedish inbox loading, error, empty, read and mark-all states', () => {
        const inboxSource = read(v2Root, 'pages', 'Notifications.js');

        expect(inboxSource).toContain('Hämtar notiser…');
        expect(inboxSource).toContain('Det gick inte att hämta dina notiser.');
        expect(inboxSource).toContain('Du har inga notiser ännu.');
        expect(inboxSource).toContain('Markera alla som lästa');
        expect(inboxSource).toContain('<ResultCard');
        expect(inboxSource).toContain('item = {notificationItem(notification)}');
        expect(inboxSource).toContain('eyebrow = {`Bevakning: ${notification.watchMatch}`}');
        expect(read(v2Root, 'design-system', 'ResultCard.js')).toContain("label = {eyebrow}");
        expect(read(v2Root, 'design-system', 'ResultCard.js')).toContain("label = 'Ny'");
        expect(read(v2Root, 'design-system', 'ResultCard.js')).toContain("borderColor: notification && !notification.read");
        expect(inboxSource).not.toContain('<NotificationCard');
    });

    it('only asks for push permission after an explicit action and explains fallback states', () => {
        const settingsSource = read(v2Root, 'design-system', 'NotificationSettings.js');

        expect(settingsSource).toContain('Aktivera pushnotiser');
        expect(settingsSource).toContain('Notification.requestPermission()');
        expect(settingsSource).toContain('E-post är alltid en pålitlig reserv');
        expect(settingsSource).toContain('lägg till Fyndmaskinen på hemskärmen');
        expect(settingsSource.indexOf('Notification.requestPermission()')).toBeGreaterThan(
            settingsSource.indexOf('const handleEnable'),
        );
    });

    it('registers the CRA worker and handles push and notification clicks', () => {
        const indexSource = read(srcRoot, 'index.js');
        const workerSource = read(srcRoot, 'service-worker.js');

        expect(indexSource).toContain('serviceWorkerRegistration.register()');
        expect(workerSource).toContain("self.addEventListener('push'");
        expect(workerSource).toContain('showNotification');
        expect(workerSource).toContain("self.addEventListener('notificationclick'");
        expect(workerSource).toContain('clients.openWindow');
        expect(workerSource).toContain('cleanupOutdatedCaches()');
        expect(workerSource).toContain('self.skipWaiting()');
        expect(indexSource).toContain('onUpdate: (registration)');
        expect(indexSource).toContain("type: 'SKIP_WAITING'");
    });
});
