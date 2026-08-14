import {
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

import {
    getWebPushPublicKey,
    removePushSubscription,
    savePushSubscription,
} from '../features/notifications';

const AUTH_OPTIONS = {
    audience: 'https://fyndmaskinen.se',
    scope: 'read:users email read:current_user',
};

const decodeVapidKey = (key) => {
    /* eslint-disable no-magic-numbers, no-mixed-operators */
    const padding = '='.repeat((4 - (key.length % 4)) % 4);
    /* eslint-enable no-magic-numbers, no-mixed-operators */
    const base64 = (key + padding).replace(/-/gu, '+').replace(/_/gu, '/');
    const raw = window.atob(base64);

    return Uint8Array.from(raw, (character) => {
        return character.charCodeAt(0);
    });
};

const getPushSupport = () => {
    return 'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
};

const isIos = () => {
    return /iPad|iPhone|iPod/u.test(navigator.userAgent);
};

const isStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
};

const NotificationSettings = () => {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const [
        accessToken, setAccessToken,
    ] = useState('');
    const [
        subscription, setSubscription,
    ] = useState(null);
    const [
        isBusy, setIsBusy,
    ] = useState(false);
    const [
        error, setError,
    ] = useState('');
    const supported = getPushSupport();
    const needsIosInstall = isIos() && !isStandalone();

    useEffect(() => {
        getAccessTokenSilently({
            authorizationParams: AUTH_OPTIONS,
        })
            .then(setAccessToken)
            .catch(() => {
                setError('Det gick inte att förbereda pushnotiser.');
            });

        if (supported) {
            navigator.serviceWorker.ready
                .then((registration) => {
                    return registration.pushManager.getSubscription();
                })
                .then(setSubscription)
                .catch(() => {
                    setError('Det gick inte att läsa pushinställningen.');
                });
        }
    }, [
        getAccessTokenSilently, supported,
    ]);

    const handleEnable = useCallback(async () => {
        setError('');
        setIsBusy(true);

        try {
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                const permissionError = 'Pushnotiser är inte tillåtna i webbläsaren. ' +
                    'Ändra behörigheten i webbläsarens inställningar om du vill aktivera dem.';

                setError(permissionError);

                return;
            }

            const publicKey = await getWebPushPublicKey(accessToken);

            if (!publicKey) {
                throw new Error('Pushnotiser är inte tillgängliga just nu.');
            }

            const registration = await navigator.serviceWorker.ready;
            const nextSubscription = await registration.pushManager.subscribe({
                applicationServerKey: decodeVapidKey(publicKey),
                userVisibleOnly: true,
            });

            const saved = await savePushSubscription(accessToken, nextSubscription);

            if (!saved) {
                await nextSubscription.unsubscribe();
                throw new Error('Det gick inte att spara pushinställningen.');
            }

            setSubscription(nextSubscription);
        } catch (pushError) {
            setError(pushError.message || 'Det gick inte att aktivera pushnotiser.');
        } finally {
            setIsBusy(false);
        }
    }, [ accessToken ]);

    const handleDisable = useCallback(async () => {
        setError('');
        setIsBusy(true);

        try {
            const removed = await removePushSubscription(accessToken, subscription.endpoint);

            if (!removed) {
                throw new Error('Det gick inte att ta bort pushinställningen.');
            }

            await subscription.unsubscribe();
            setSubscription(null);
        } catch (pushError) {
            setError(pushError.message || 'Det gick inte att stänga av pushnotiser.');
        } finally {
            setIsBusy(false);
        }
    }, [
        accessToken, subscription,
    ]);

    let guidance = 'Få en pushnotis när en bevakning hittar något nytt.';

    if (!supported) {
        guidance = 'Den här webbläsaren stöder inte pushnotiser.';
    } else if (needsIosInstall) {
        guidance = 'På iPhone och iPad: lägg till Fyndmaskinen på hemskärmen ' +
            'och öppna appen därifrån innan push kan aktiveras.';
    } else if (supported && Notification.permission === 'denied') {
        guidance = 'Pushnotiser är blockerade. Tillåt dem i webbläsarens inställningar för webbplatsen.';
    } else if (subscription) {
        guidance = 'Pushnotiser är aktiverade på den här enheten.';
    }

    const canEnable = supported &&
        !needsIosInstall &&
        Notification.permission !== 'denied' &&
        Boolean(accessToken);

    return (
        <Card
            variant = 'outlined'
        >
            <CardContent>
                <Stack
                    spacing = {2}
                >
                    <Stack
                        spacing = {0.5}
                    >
                        <Typography
                            component = 'h2'
                            variant = 'h6'
                        >
                            {'Pushnotiser'}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                        >
                            {guidance}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                            variant = 'body2'
                        >
                            {'E-post är alltid en pålitlig reserv, även om push är avstängt eller inte når fram.'}
                        </Typography>
                    </Stack>
                    {error && (
                        <Alert
                            severity = 'error'
                        >
                            {error}
                        </Alert>
                    )}
                    {subscription
                        ? (
                            <Button
                                disabled = {isBusy}
                                onClick = {handleDisable}
                                startIcon = {
                                    isBusy
                                        ? <CircularProgress
                                            // eslint-disable-next-line react/jsx-indent-props
                                            size = {20}
                                        />
                                        : <NotificationsOffIcon />
                                }
                                variant = 'outlined'
                            >
                                {'Stäng av pushnotiser'}
                            </Button>
                        )
                        : (
                            <Button
                                disabled = {!canEnable || isBusy}
                                onClick = {handleEnable}
                                startIcon = {
                                    isBusy
                                        ? <CircularProgress
                                            // eslint-disable-next-line react/jsx-indent-props
                                            size = {20}
                                        />
                                        : <NotificationsActiveIcon />
                                }
                                variant = 'contained'
                            >
                                {'Aktivera pushnotiser'}
                            </Button>
                        )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default NotificationSettings;
