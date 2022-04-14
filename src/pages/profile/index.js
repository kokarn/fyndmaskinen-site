import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    // Checkbox,
    List,
    ListItem,
    // ListItemButton,
    ListItemText,
    // ListItemIcon,
    IconButton,
    Box,
    Grid,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    useApi,
} from '../../hooks/useApi';
import AddWatch from '../../components/add-watch';
import LogoutButton from '../../components/logout-button';

const Profile = () => {
    const {
        loginWithRedirect,
        // login,
        user,
        // isAuthenticated,
        // isLoading,
        getAccessTokenWithPopup,
        getAccessTokenSilently,
    } = useAuth0();
    const opts = {
        audience: 'https://fyndmaskinen.kokarn.com',
        scope: 'read:users email read:current_user',

    };

    const {
        // loading,
        error,
        refresh,
        apiData,
    } = useApi(
        `${window.API_HOSTNAME}/graphql`,
        {
            ...opts,
            body: JSON.stringify({
                query: `{
                    getWatches {
                        match
                        notify
                    }
                }`,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        },
    );

    const getTokenAndTryAgain = async () => {
        console.log('get token and try again');
        await getAccessTokenWithPopup(opts);
        refresh();
    };

    const handleDeleteButtonClick = async (match) => {
        let accessToken;

        try {
            accessToken = await getAccessTokenSilently({
                audience: opts.audience,
                scope: opts.scope,
            });
        } catch (accessTokenError) {
            console.error(accessTokenError);
        }

        await fetch(`${window.API_HOSTNAME}/graphql`, {
            body: JSON.stringify({
                query: `mutation {
                    removeWatch(match: "${match}") {
                        match
                        notify
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
    };

    if (error) {
        if (error.error === 'login_required') {
            return (
                <button
                    onClick = {() => {
                        return loginWithRedirect(opts);
                    }}
                >
                    {'Login'}
                </button>
            );
        }

        if (error.error === 'consent_required') {
            return (
                <button
                    onClick = {getTokenAndTryAgain}
                >
                    {'Consent to reading users'}
                </button>
            );
        }

        return <div>{'Oops'} {error.message}</div>;
    }

    return (
        <Box
            m = {2}
            sx = {{
                minHeight: '100vh',
            }}
        >
            <Grid
                container
                spacing = {2}
                // alignItems = { 'flex-end' }
            >
                <Grid
                    item
                    md = {12}
                    xs = {12}
                >
                    <AddWatch
                        key = 'add-match'
                    />
                </Grid>
                <Grid
                    item
                    md = {12}
                    xs = {12}
                >
                    <Typography
                        color = {'inherit'}
                        variant = {'h5'}
                    >
                        { 'Aktiva bevakningar' }
                    </Typography>
                    <List
                        key = 'my-monitors'
                    >
                        {apiData.getWatches.map((watch) => {
                            return (
                                <ListItem
                                    disableGutters
                                    key = {`watch-${user?.name}-${watch.match}`}
                                    secondaryAction = {
                                        <IconButton
                                            aria-label = 'delete'
                                            edge = 'end'
                                        >
                                            <DeleteIcon
                                                onClick = {() => {
                                                    handleDeleteButtonClick(watch.match);
                                                }}
                                            />
                                        </IconButton>
                                    }
                                >
                                    {/* <ListItemButton
                                        role = {'undefined'}
                                        // onClick = {handleToggle(value)}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                // checked = {checked.indexOf(value) !== -1}
                                                checked
                                                disableRipple
                                                edge = 'start'
                                                // inputProps = {{ 'aria-labelledby': labelId }}
                                                tabIndex = {-1}
                                            />
                                        </ListItemIcon>
                                    </ListItemButton> */}
                                    <ListItemText
                                        primary = {watch.match}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
            <LogoutButton />
        </Box>
    );
};

export default Profile;
