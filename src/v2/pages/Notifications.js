import {
    useCallback,
    useEffect,
    useState,
} from 'react';
/* eslint-disable id-blacklist */
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from 'react-query';

import {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from '../../features/notifications';
import AccountPageShell from '../design-system/AccountPageShell';
import ResultCard from '../design-system/ResultCard';

const AUTH_OPTIONS = {
    audience: 'https://fyndmaskinen.se',
    scope: 'read:users email read:current_user',
};

const notificationItem = (notification) => {
    return {
        currentPrice: notification.currentPrice,
        imageUrl: notification.imageUrl,
        title: notification.itemTitle,
        type: notification.itemType,
        url: notification.itemUrl,
    };
};

const Notifications = () => {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const [
        accessToken, setAccessToken,
    ] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        getAccessTokenSilently({
            authorizationParams: AUTH_OPTIONS,
        })
            .then(setAccessToken)
            .catch(console.error);
    }, [ getAccessTokenSilently ]);

    const {
        data = {
            getNotifications: [],
            unreadNotificationCount: 0,
        },
        isError,
        isLoading,
    } = useQuery([
        'notifications',
        accessToken,
    ], () => {
        return getNotifications(accessToken);
    }, {
        enabled: Boolean(accessToken),
        refetchOnWindowFocus: true,
    });
    const invalidateNotifications = useCallback(() => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotificationCount');
    }, [ queryClient ]);
    const readMutation = useMutation((id) => {
        return markNotificationRead(accessToken, id).then((marked) => {
            if (!marked) {
                throw new Error('Det gick inte att markera notisen som läst.');
            }

            return marked;
        });
    }, {
        onSuccess: invalidateNotifications,
    });
    const readAllMutation = useMutation(() => {
        return markAllNotificationsRead(accessToken).then((marked) => {
            if (!marked) {
                throw new Error('Det gick inte att markera alla notiser som lästa.');
            }

            return marked;
        });
    }, {
        onSuccess: invalidateNotifications,
    });
    const handleOpen = useCallback(async (notification) => {
        if (!notification.read) {
            try {
                await readMutation.mutateAsync(notification.id);
            } catch (error) {
                return;
            }
        }

        window.location.assign(notification.itemUrl);
    }, [ readMutation ]);
    const handleReadAll = useCallback(() => {
        readAllMutation.mutate();
    }, [ readAllMutation ]);
    const notifications = data.getNotifications || [];

    return (
        <AccountPageShell
            description = 'Nya träffar från dina bevakningar samlade på ett ställe.'
            title = 'Notiser'
        >
            <Stack
                spacing = {2}
            >
                <Stack
                    alignItems = {{
                        sm: 'center',
                        xs: 'stretch',
                    }}
                    direction = {{
                        sm: 'row',
                        xs: 'column',
                    }}
                    justifyContent = 'space-between'
                    spacing = {1.5}
                >
                    <Typography
                        color = 'text.secondary'
                    >
                        {data.unreadNotificationCount
                            ? `${data.unreadNotificationCount} olästa notiser`
                            : 'Inga olästa notiser'}
                    </Typography>
                    <Button
                        disabled = {
                            !data.unreadNotificationCount || readAllMutation.isLoading
                        }
                        onClick = {handleReadAll}
                        startIcon = {<DoneAllIcon />}
                        variant = 'outlined'
                    >
                        {'Markera alla som lästa'}
                    </Button>
                </Stack>
                {(isLoading || !accessToken) && (
                    <Stack
                        alignItems = 'center'
                        direction = 'row'
                        role = 'status'
                        spacing = {1.5}
                    >
                        <CircularProgress
                            size = {24}
                        />
                        <Typography>
                            {'Hämtar notiser…'}
                        </Typography>
                    </Stack>
                )}
                {isError && (
                    <Alert
                        severity = 'error'
                    >
                        {'Det gick inte att hämta dina notiser.'}
                    </Alert>
                )}
                {!isLoading && !isError && notifications.length === 0 && (
                    <Alert
                        severity = 'info'
                    >
                        {'Du har inga notiser ännu.'}
                    </Alert>
                )}
                <Grid
                    container
                    spacing = {{
                        sm: 1.5,
                        xs: 1,
                    }}
                >
                    {notifications.map((notification) => {
                        return (
                            <Grid
                                item
                                key = {notification.id}
                                lg = {3}
                                sm = {4}
                                xs = {12}
                            >
                                <ResultCard
                                    eyebrow = {`Bevakning: ${notification.watchMatch}`}
                                    item = {notificationItem(notification)}
                                    notification = {notification}
                                    onOpen = {handleOpen}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Stack>
        </AccountPageShell>
    );
};

export default Notifications;
