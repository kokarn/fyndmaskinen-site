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
import LoginIcon from '@mui/icons-material/Login';

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
                        to='/profile'
                    >
                        <Avatar
                            alt={user.name}
                            imgProps={{
                                referrerPolicy: 'no-referrer',
                            }}
                            src={user.picture}
                            variant={'rounded'}
                        />
                    </Link>
                </div>
            )}
            {!isAuthenticated && !isLoading && (
                <Button

                    onClick={() => {
                        return loginWithRedirect();
                    }}
                    variant='contained'
                    sx={{
                        backgroundColor: '#26828B',
                        gap: 1,

                    }}
                >
                    <span sx={{ borderRadius: 1 }}><LoginIcon /></span>  <span>{'Logga in'}</span>
                </Button>
            )}
            {isLoading && (
                <LoadingButton
                    loading
                    variant='text'
                >
                    {'Submit'}
                </LoadingButton>
            )}
        </div>
    );
};

export default LoginButton;
