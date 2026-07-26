import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import {
    Link,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';

import getAllWatches from '../../features/get-all-watches';
import AccountPageShell from '../design-system/AccountPageShell';

const STALE_TIME = 600000;

const AdminWatches = () => {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const [
        accessToken, setAccessToken,
    ] = useState('');

    useEffect(() => {
        getAccessTokenSilently({
            audience: 'https://fyndmaskinen.se',
            scope: 'read:users email read:current_user',
        })
            .then(setAccessToken)
            .catch(console.error);
    }, [ getAccessTokenSilently ]);

    const {
        data: watches,
        isFetching,
    } = useQuery([
        'all-watches',
        accessToken,
    ], getAllWatches, {
        enabled: Boolean(accessToken),
        placeholderData: [],
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME,
    });
    const groupedByUser = watches.reduce((result, watch) => {
        result[ watch.notify ] = result[ watch.notify ] || [];
        result[ watch.notify ].push(watch.match);

        return result;
    }, {});
    const users = Object.keys(groupedByUser).sort();

    return (
        <AccountPageShell
            description = {isFetching
                ? 'Hämtar bevakningar…'
                : `${watches.length} bevakningar från ${users.length} användare`}
            title = 'Alla bevakningar'
        >
            {isFetching && watches.length === 0 && (
                <CircularProgress
                    size = {24}
                />
            )}
            <Stack
                spacing = {1.5}
            >
                {users.map((email) => {
                    const userWatches = groupedByUser[ email ];

                    return (
                        <Card
                            key = {email}
                            variant = 'outlined'
                        >
                            <CardContent>
                                <Stack
                                    spacing = {1.5}
                                >
                                    <Stack
                                        alignItems = 'baseline'
                                        direction = {{
                                            sm: 'row',
                                            xs: 'column',
                                        }}
                                        justifyContent = 'space-between'
                                    >
                                        <Typography
                                            sx = {{
                                                fontWeight: 800,
                                            }}
                                        >
                                            {email}
                                        </Typography>
                                        <Typography
                                            color = 'text.secondary'
                                        >
                                            {`${userWatches.length} bevakningar`}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction = 'row'
                                        flexWrap = 'wrap'
                                        gap = {1}
                                    >
                                        {userWatches.map((match) => {
                                            return (
                                                <Chip
                                                    clickable
                                                    component = {Link}
                                                    key = {match}
                                                    label = {match}
                                                    to = {`/v2/search/${encodeURIComponent(match)}`}
                                                    variant = 'outlined'
                                                />
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>
        </AccountPageShell>
    );
};

export default AdminWatches;
