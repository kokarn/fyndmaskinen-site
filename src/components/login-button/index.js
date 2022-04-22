import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Avatar,
    Button,
} from '@mui/material';
import {
    Link,
} from 'react-router-dom';
import {
    LoadingButton,
} from '@mui/lab';

const LoginButton = () => {
    const {
        loginWithRedirect,
        user,
        isAuthenticated,
        isLoading,
    } = useAuth0();

    return (
        <div>
            {!isLoading && isAuthenticated && (
                <div>
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
                    // color = 'inherit'
                    onClick = {() => {
                        return loginWithRedirect();
                    }}
                    variant = 'text'
                >
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
