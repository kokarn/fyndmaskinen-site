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

// import {
//     useApi,
// } from '../../hooks/useApi';

const AddWatch = () => {
    const {
        // loginWithRedirect,
        // login,
        user,
        // isAuthenticated,
        // isLoading,
        // getAccessTokenWithPopup,
        getAccessTokenSilently,
    } = useAuth0();
    const [
        newMatchString,
        setNewMatchString,
    ] = useState('');
    const searchRef = useRef(null);

    const opts = {
        audience: 'https://fyndmaskinen.kokarn.com',
        scope: 'read:users email read:current_user',
    };

    // if (!isAuthenticated) {
    //     return null;
    // }
    useEffect(() => {
        (async () => {
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

            await fetch(`${window.API_HOSTNAME}/graphql`, {
                body: JSON.stringify({
                    query: `mutation {
                        addWatch(match: "${newMatchString}", notify: "${user.email}") {
                            match
                        }
                    }`,
                }),
                headers: {
                    authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            return true;
        })();
    }, [newMatchString]);

    return (
        <form
            autoComplete = 'off'
            noValidate
            onSubmit = {(event) => {
                event.preventDefault();
                console.log(searchRef.current.value);
                setNewMatchString(searchRef.current.value);
            }}
        >
            <TextField
                fullWidth
                id = 'standard-name'
                inputProps = {{
                    type: 'search',
                }}
                inputRef = {searchRef}
                label = {'Lägg till bevakning...'}
                margin = 'normal'
                variant = 'standard'
            />
            {/* <FormGroup>
            <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Auctions"
            />
            <FormControlLabel
                disabled
                control={<Checkbox />}
                label="Blocket"
            />
            <FormControlLabel
                disabled
                control={<Checkbox />}
                label="Marketplace"
            />
        </FormGroup> */}
        </form>
    );
};

export default AddWatch;
