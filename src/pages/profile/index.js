import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    // ListItemIcon,
    IconButton,
    Box,
    // Grid,
    Typography,
    Skeleton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from 'react-query';
import {
    Link,
} from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';

import removeWatch from '../../features/remove-watch';
import getWatches from '../../features/get-watches';
import getWatchLimit from '../../features/get-watch-limit';

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
        audience: 'https://fyndmaskinen.se',
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

    const {
        // isFetching,
        data: watchLimit,
    } = useQuery(
        [
            'watchLimit',
            accessToken,
        ],
        getWatchLimit,
        {
            placeholderData: 0,
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
                flex: '1 0 auto',
                minHeight: '10vh',
            }}
        >
            <Grid
                container
                spacing = {4}
                // alignItems = { 'flex-end' }
            >
                <Grid
                    md = {12}
                    xs = {12}
                >
                    <AddWatch
                        disabled = {watches.length >= watchLimit}
                        key = 'add-match'
                    />
                </Grid>
                <Grid
                    md = {12}
                    xs = {12}
                >
                    <Typography
                        variant = {'h5'}
                    >
                        {'Aktiva bevakningar '}
                        {(!watches.length || !watchLimit) ?
                            <Skeleton
                                sx = {{
                                    display: 'inline-block',
                                    fontSize: '1rem',
                                }}
                                variant = 'h5'
                                width = {40}
                            /> :
                            <span>
                                {`${watches.length}/${watchLimit}`}
                            </span>
                        }
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
                                            onClick = {(event) => {
                                                mutation.mutate(watch.match);
                                                event.preventDefault();
                                            }}
                                        >
                                            <DeleteIcon />
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
                <Grid
                    md = {6}
                    xs = {6}
                >
                    <Button
                        href = {`${window.PURCHASE_URL}?prefilled_email=${user?.email}`}
                        variant = 'outlined'
                    >
                        {'Köp fler bevakningar'}
                    </Button>
                </Grid>
                <Grid
                    md = {6}
                    xs = {6}
                >
                    <Button
                        href = {window.PORTAL_URL}
                        variant = 'outlined'
                    >
                        {'Hantera betalningar'}
                    </Button>
                </Grid>
            </Grid>
            <LogoutButton />
        </Box>
    );
};

export default Profile;
