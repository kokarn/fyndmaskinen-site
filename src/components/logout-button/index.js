import {
    useCallback,
} from 'react';
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

    const handleLogout = useCallback(() => {
        return logout({
            returnTo: window.location.origin,
        });
    }, [ logout ]);

    return (
        <Button
            align = 'right'
            color = 'error'
            onClick = {handleLogout}
            variant = 'contained'
        >
            {'Logga ut'}
        </Button>
    );
};

export default LogoutButton;
