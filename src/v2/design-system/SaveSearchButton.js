import {
    useCallback,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Button,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import {
    useMutation,
    useQueryClient,
} from 'react-query';
import PropTypes from 'prop-types';

import addWatch from '../../features/add-watch';
import {
    useNotification,
} from '../../components/notification';

const AUTH_OPTIONS = {
    audience: 'https://fyndmaskinen.se',
    scope: 'read:users email read:current_user',
};

const SaveSearchButton = ({
    filters,
    fullWidth,
    searchPhrase,
}) => {
    const {
        getAccessTokenSilently,
        isAuthenticated,
        loginWithRedirect,
        user,
    } = useAuth0();
    const queryClient = useQueryClient();
    const showNotification = useNotification();
    const mutation = useMutation(async () => {
        const accessToken = await getAccessTokenSilently({
            authorizationParams: AUTH_OPTIONS,
        });
        const response = await addWatch(accessToken, user.email, searchPhrase, filters);

        if (!response.ok) {
            throw new Error('Bevakningen kunde inte sparas');
        }

        const payload = await response.json();

        if (payload.errors) {
            throw new Error(payload.errors[ 0 ]?.message || 'Bevakningen kunde inte sparas');
        }

        return payload.data.addWatch;
    }, {
        onError: () => {
            showNotification('Bevakningen kunde inte sparas', 'error');
        },
        onSuccess: () => {
            queryClient.invalidateQueries('watches');
            showNotification('Bevakningen är sparad', 'success');
        },
    });
    const handleSave = useCallback(() => {
        if (!isAuthenticated) {
            return loginWithRedirect({
                appState: {
                    returnTo: window.location.pathname,
                },
                authorizationParams: AUTH_OPTIONS,
            });
        }

        return mutation.mutate();
    }, [
        isAuthenticated,
        loginWithRedirect,
        mutation,
    ]);

    return (
        <Button
            disabled = {mutation.isLoading}
            fullWidth = {fullWidth}
            onClick = {handleSave}
            startIcon = {<BookmarkAddIcon />}
            variant = 'outlined'
        >
            {mutation.isLoading
                ? 'Sparar…'
                : 'Spara bevakning'}
        </Button>
    );
};

SaveSearchButton.propTypes = {
    filters: PropTypes.shape({
        maxPrice: PropTypes.number,
        sources: PropTypes.arrayOf(PropTypes.string).isRequired,
        version: PropTypes.number.isRequired,
    }).isRequired,
    fullWidth: PropTypes.bool,
    searchPhrase: PropTypes.string.isRequired,
};

SaveSearchButton.defaultProps = {
    fullWidth: false,
};

export default SaveSearchButton;
