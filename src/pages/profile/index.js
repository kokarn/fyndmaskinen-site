import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    // Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    // ListItemIcon,
    IconButton,
    Box,
    Grid,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from 'react-query';
import {
    Link
} from 'react-router-dom';

import removeWatch from '../../features/remove-watch';
import getWatches from '../../features/get-watches';

import AddWatch from '../../components/add-watch';
import LogoutButton from '../../components/logout-button';

const Profile = () => {
    const {
        // loginWithRedirect,
        user,
        // getAccessTokenWithPopup,
        getAccessTokenSilently,
    } = useAuth0();
    const [
        accessToken,
        setAccessToken,
    ] = useState('');
    const opts = {
        audience: 'https://fyndmaskinen.kokarn.com',
        scope: 'read:users email read:current_user',
    };

    const queryClient = useQueryClient();

    // const getTokenAndTryAgain = async () => {
    //     console.log('get token and try again');
    //     await getAccessTokenWithPopup(opts);
    // };

    const mutation = useMutation(async (match) => {
        let temporaryAccessToken;

        try {
            temporaryAccessToken = await getAccessTokenSilently({
                audience: opts.audience,
                scope: opts.scope,
            });
        } catch (accessTokenError) {
            console.error(accessTokenError);
        }

        return removeWatch(temporaryAccessToken, match);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries([
                'watches',
                accessToken,
            ]);
        },
    });

    useEffect(() => {
        (async () => {
            try {
                const currentAccessToken = await getAccessTokenSilently({
                    audience: opts.audience,
                    scope: opts.scope,
                });

                setAccessToken(currentAccessToken);
                queryClient.invalidateQueries([
                    'watches',
                    accessToken,
                ]);
            } catch (accessTokenError) {
                console.error(accessTokenError);
            }
        })();
    }, []);

    const {
        // isFetching,
        data: watches,
    } = useQuery(
        [
            'watches',
            accessToken,
        ],
        getWatches,
        {
            placeholderData: [],
            refetchInterval: 600000,
            // refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    // if (error) {
    //     if (error.error === 'login_required') {
    //         return (
    //             <button
    //                 onClick = {() => {
    //                     return loginWithRedirect(opts);
    //                 }}
    //             >
    //                 {'Login'}
    //             </button>
    //         );
    //     }

    //     if (error.error === 'consent_required') {
    //         return (
    //             <button
    //                 onClick = {getTokenAndTryAgain}
    //             >
    //                 {'Consent to reading users'}
    //             </button>
    //         );
    //     }

    //     return <div>{'Oops'} {error.message}</div>;
    // }

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
                        {watches.map((watch) => {
                            return (
                                <ListItem
                                    component = {Link}
                                    disableGutters
                                    key = {`watch-${user?.name}-${watch.match}`}
                                    secondaryAction = {
                                        <IconButton
                                            aria-label = 'delete'
                                            edge = 'end'
                                        >
                                            <DeleteIcon
                                                onClick = {(event) => {
                                                    mutation.mutate(watch.match);
                                                    event.preventDefault();
                                                }}
                                            />
                                        </IconButton>
                                    }
                                    to = {`/search/${watch.match}`}
                                >
                                    <ListItemButton
                                        disableGutters
                                        // onClick = {handleToggle(value)}
                                    >
                                        {/* <ListItemIcon>
                                            <Checkbox
                                                // checked = {checked.indexOf(value) !== -1}
                                                checked
                                                disableRipple
                                                edge = 'start'
                                                // inputProps = {{ 'aria-labelledby': labelId }}
                                                tabIndex = {-1}
                                            />
                                        </ListItemIcon> */}
                                        <ListItemText
                                            primary = {watch.match}
                                            // secondary = {'XXX objekt'}
                                        />
                                    </ListItemButton>
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
