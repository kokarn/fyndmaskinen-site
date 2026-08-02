import {
    useCallback,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Avatar,
    Button,
    CircularProgress,
    IconButton,
    Stack,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {
    Link,
} from 'react-router-dom';

import NotificationBell from './NotificationBell';

const ADMIN_EMAIL = 'kokarn@gmail.com';

const AccountActions = () => {
    const {
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        user,
    } = useAuth0();
    const handleLogin = useCallback(() => {
        return loginWithRedirect();
    }, [ loginWithRedirect ]);

    if (isLoading) {
        return (
            <CircularProgress
                aria-label = 'Laddar konto'
                size = {28}
            />
        );
    }

    if (!isAuthenticated) {
        return (
            <Button
                onClick = {handleLogin}
                startIcon = {<LoginIcon />}
                variant = 'contained'
            >
                {'Logga in'}
            </Button>
        );
    }

    return (
        <Stack
            alignItems = 'center'
            direction = 'row'
            spacing = {1}
            sx = {{
                flexShrink: 0,
            }}
        >
            {user?.email === ADMIN_EMAIL && (
                <>
                    <Button
                        component = {Link}
                        startIcon = {<AdminPanelSettingsIcon />}
                        sx = {{
                            display: {
                                sm: 'inline-flex',
                                xs: 'none',
                            },
                        }}
                        to = '/admin'
                        variant = 'text'
                    >
                        {'Admin'}
                    </Button>
                    <IconButton
                        aria-label = 'Admin'
                        color = 'secondary'
                        component = {Link}
                        sx = {{
                            display: {
                                sm: 'none',
                                xs: 'inline-flex',
                            },
                        }}
                        to = '/admin'
                    >
                        <AdminPanelSettingsIcon />
                    </IconButton>
                </>
            )}
            <NotificationBell />
            <Avatar
                alt = {user?.name || 'Profil'}
                component = {Link}
                src = {user?.picture}
                sx = {{
                    height: 38,
                    width: 38,
                }}
                to = '/profile'
            />
        </Stack>
    );
};

export default AccountActions;
