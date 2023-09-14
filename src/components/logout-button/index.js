import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Button,
} from '@mui/material';

const LogoutButton = () => {
    const {
        logout,
    } = useAuth0();

    return (
        <Button
            align = 'right'
            color = 'error'
            onClick = {() => {
                return logout({
                    returnTo: window.location.origin,
                });
            }}
            variant = 'contained'
        >
            {'Logga ut'}
        </Button>
    );
};

export default LogoutButton;
