import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Fab,
} from '@mui/material';

const LogoutButton = () => {
    const {
        logout,
    } = useAuth0();

    return (
        <Fab
            align='right'
            onClick={() => {
                return logout({
                    returnTo: window.location.origin,
                });
            }}
            sx={{
                backgroundColor: 'red',
                bottom: (theme) => {
                    return theme.spacing(2);
                },
                position: 'fixed',
                right: (theme) => {
                    return theme.spacing(2);
                },
            }}
            variant='extended'
        >
            {'Logga ut'}
        </Fab>
    );
};

export default LogoutButton;
