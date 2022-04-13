import {
    useAuth0,
} from '@auth0/auth0-react';

const LogoutButton = () => {
    const {
        logout,
    } = useAuth0();

    return (
        <button
            onClick = {() => {
                return logout({
                    returnTo: window.location.origin,
                });
            }}
        >
            {'Logga ut'}
        </button>
    );
};

export default LogoutButton;
