import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Box,
    Typography,
} from '@mui/material';
import {
    useQuery,
    useQueryClient,
} from 'react-query';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Helmet,
} from 'react-helmet';

import getAllWatches from '../../features/get-all-watches';

import WatchListItem from '../../components/watch-list-item';

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
        getAllWatches,
        {
            placeholderData: [],
            refetchInterval: 600000,
            // refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    );

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
                        <span>
                            {`${watches.length}`}
                        </span>
                    </Typography>
                </Grid>
                <Grid
                    md = {12}
                    xs = {12}
                >
                    {watches.map((watch) => {
                        return (
                            <WatchListItem
                                key = {`watch-${user?.name}-${watch.match}`}
                                watchString = {`${watch.match} - ${watch.notify}`}
                            />
                        );
                    })}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
