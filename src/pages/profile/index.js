/* eslint-disable react/no-multi-comp */
import {
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Button,
    Box,
    Typography,
    Skeleton,
} from '@mui/material';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from 'react-query';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Helmet,
} from 'react-helmet';
import PropTypes from 'prop-types';

import removeWatch from '../../features/remove-watch';
import getWatches from '../../features/get-watches';
import getWatchLimit from '../../features/get-watch-limit';

import AddWatch from '../../components/add-watch';
import LogoutButton from '../../components/logout-button';
import WatchListItem from '../../components/watch-list-item';

const WatchRow = ({
    match,
    onDelete,
    userName,
}) => {
    const handleDelete = useCallback(() => {
        onDelete(match);
    }, [
        match,
        onDelete,
    ]);

    return (
        <WatchListItem
            key = {`watch-${userName}-${match}`}
            onDelete = {handleDelete}
            watchString = {match}
        />
    );
};

WatchRow.propTypes = {
    match: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    userName: PropTypes.string,
};

WatchRow.defaultProps = {
    userName: '',
};

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
        },
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
        },
    );

    const handleWatchDelete = useCallback((match) => {
        mutation.mutate(match);
    }, [ mutation ]);

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
            <Helmet>
                <title>
                    {'Profil'}
                </title>
            </Helmet>
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
                    md = {9}
                    xs = {9}
                >
                    <Typography
                        sx = {{
                            color: '#fff',
                            textShadow: '0 0 4px black',
                        }}
                        variant = {'h5'}
                    >
                        {'Aktiva bevakningar '}
                    </Typography>
                </Grid>
                <Grid
                    md = {3}
                    xs = {3}
                >
                    <Typography
                        sx = {{
                            textAlign: 'right',
                        }}
                        variant = {'h5'}
                    >
                        {(watchLimit) ?
                            <span>
                                {`${watches.length}/${watchLimit}`}
                            </span> :
                            <Skeleton
                                sx = {{
                                    display: 'inline-block',
                                    fontSize: '1rem',
                                }}
                                variant = 'h5'
                                width = {40}
                            />
                        }
                    </Typography>
                </Grid>
                <Grid
                    md = {12}
                    xs = {12}
                >
                    {watches.map((watch) => {
                        return (
                            <WatchRow
                                key = {`watch-${user?.name}-${watch.match}`}
                                match = {watch.match}
                                onDelete = {handleWatchDelete}
                                userName = {user?.name}
                            />
                        );
                    })}
                </Grid>
                <Grid
                    md = {6}
                    xs = {6}
                >
                    <Button
                        color = 'secondary'
                        href = {`${window.PURCHASE_URL}?prefilled_email=${user?.email}`}
                        variant = 'contained'
                    >
                        {'Köp fler bevakningar'}
                    </Button>
                </Grid>
                <Grid
                    display = {'flex'}
                    justifyContent = {'flex-end'}
                    md = {6}
                    xs = {6}
                >
                    <Button
                        color = 'secondary'
                        href = {window.PORTAL_URL}
                        variant = 'contained'
                    >
                        {'Hantera betalningar'}
                    </Button>
                </Grid>
                <Grid
                    display = {'flex'}
                    justifyContent = {'end'}
                    md = {2}
                    mdOffset = {10}
                    xs = {2}
                    xsOffset = {10}
                >
                    <LogoutButton />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
