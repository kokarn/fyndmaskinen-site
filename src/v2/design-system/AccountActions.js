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
    Stack,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Link,
} from 'react-router-dom';

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
        >
            {user?.email === ADMIN_EMAIL && (
                <Button
                    component = {Link}
                    startIcon = {<AdminPanelSettingsIcon />}
                    to = '/admin'
                    variant = 'text'
                >
                    {'Admin'}
                </Button>
            )}
            <Button
                component = {Link}
                startIcon = {<VisibilityIcon />}
                to = '/profile'
                variant = 'text'
            >
                {'Bevakningar'}
            </Button>
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
