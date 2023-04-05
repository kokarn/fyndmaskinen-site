import {
    useState,
    useEffect,
    useRef,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    TextField,
} from '@mui/material';
import {
    useMutation,
    useQueryClient,
} from 'react-query';
import PropTypes from 'prop-types';

import addWatch from '../../features/add-watch';

const AddWatch = ({
    disabled,
}) => {
    const {
        user,
        getAccessTokenSilently,
    } = useAuth0();
    const [
        newMatchString,
        setNewMatchString,
    ] = useState('');
    const searchRef = useRef(null);

    const opts = {
        audience: 'https://fyndmaskinen.se',
        scope: 'read:users email read:current_user',
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(async () => {
        let accessToken;

        try {
            accessToken = await getAccessTokenSilently({
                audience: opts.audience,
                scope: opts.scope,
            });
        } catch (accessTokenError) {
            console.error(accessTokenError);
        }

        if (newMatchString.length === 0) {
            return true;
        }

        return addWatch(accessToken, user.email, newMatchString);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('watches');
        },
    });

    useEffect(() => {
        mutation.mutate(newMatchString);
    }, [newMatchString]);

    return (
        <form
            autoComplete = 'off'
            noValidate
            onSubmit = {(event) => {
                event.preventDefault();
                console.log(searchRef.current.value);
                setNewMatchString(searchRef.current.value);
                searchRef.current.value = '';
            }}
        >
            <TextField
                disabled = {disabled}
                fullWidth
                id = 'standard-name'
                inputProps = {{
                    type: 'search',
                }}
                inputRef = {searchRef}
                label = {'Lägg till bevakning...'}
                margin = 'normal'
                sx = {{
                    backgroundColor: '#FFFFFF',
                    paddingRight: 0,
                }}
                variant = 'outlined'
            />
        </form>
    );
};

AddWatch.propTypes = {
    disabled: PropTypes.bool.isRequired,
};

export default AddWatch;
