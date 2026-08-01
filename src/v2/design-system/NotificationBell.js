import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Badge,
    IconButton,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {
    Link,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';

import {
    getUnreadNotificationCount,
} from '../../features/notifications';

const AUTH_OPTIONS = {
    audience: 'https://fyndmaskinen.se',
    scope: 'read:users email read:current_user',
};

const NotificationBell = () => {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const [
        accessToken, setAccessToken,
    ] = useState('');

    useEffect(() => {
        getAccessTokenSilently({
            authorizationParams: AUTH_OPTIONS,
        })
            .then(setAccessToken)
            .catch(console.error);
    }, [ getAccessTokenSilently ]);

    const {
        data: unreadCount = 0,
    } = useQuery([
        'unreadNotificationCount',
        accessToken,
    ], () => {
        return getUnreadNotificationCount(accessToken);
    }, {
        enabled: Boolean(accessToken),
        refetchInterval: 60_000,
        refetchOnWindowFocus: true,
    });

    return (
        <IconButton
            aria-label = 'Notiser'
            color = 'secondary'
            component = {Link}
            to = '/notifications'
        >
            <Badge
                badgeContent = {unreadCount}
                color = 'primary'
                max = {99}
            >
                <NotificationsNoneIcon />
            </Badge>
        </IconButton>
    );
};

export default NotificationBell;
