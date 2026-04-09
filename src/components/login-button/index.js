import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Avatar,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Link,
} from 'react-router-dom';
import {
    LoadingButton,
} from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const ADMIN_EMAIL = 'kokarn@gmail.com';

const LoginButton = () => {
    const {
        loginWithRedirect,
        user,
        isAuthenticated,
        isLoading,
    } = useAuth0();

    const isAdmin = isAuthenticated && user?.email === ADMIN_EMAIL;

    return (
        <div>
            {!isLoading && isAuthenticated && (
                <div
                    style = {{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 8,
                    }}
                >
                    {isAdmin && (
                        <Tooltip
                            title = 'Admin'
                        >
                            <IconButton
                                component = {Link}
                                size = 'small'
                                to = '/admin'
                            >
                                <AdminPanelSettingsIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Link
                        to = '/profile'
                    >
                        <Avatar
                            alt = {user.name}
                            imgProps = {{
                                referrerPolicy: 'no-referrer',
                            }}
                            src = {user.picture}
                            variant = {'rounded'}
                        />
                    </Link>
                </div>
            )}
            {!isAuthenticated && !isLoading && (
                <Button
                    onClick = {() => {
                        return loginWithRedirect();
                    }}
                    sx = {{
                        gap: 1,
                    }}
                    variant = 'contained'
                >
                    <LoginIcon />
                    {'Logga in'}
                </Button>
            )}
            {isLoading && (
                <LoadingButton
                    loading
                    variant = 'text'
                >
                    {'Submit'}
                </LoadingButton>
            )}
        </div>
    );
};

export default LoginButton;
