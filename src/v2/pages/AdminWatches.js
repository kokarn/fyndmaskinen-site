import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    CircularProgress,
    Stack,
} from '@mui/material';
import {
    useQuery,
} from 'react-query';

import getAllWatches from '../../features/get-all-watches';
import AccountPageShell from '../design-system/AccountPageShell';
import WatchGroupCard from '../design-system/WatchGroupCard';

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
                        <WatchGroupCard
                            key = {email}
                            label = {email}
                            watches = {userWatches}
                        />
                    );
                })}
            </Stack>
        </AccountPageShell>
    );
};

export default AdminWatches;
