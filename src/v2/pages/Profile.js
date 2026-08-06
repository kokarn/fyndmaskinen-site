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
    Card,
    CardContent,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';


import {
    useMutation,
    useQuery,
    useQueryClient,
} from 'react-query';

import getWatches from '../../features/get-watches';
import getWatchLimit from '../../features/get-watch-limit';
import removeWatch from '../../features/remove-watch';
import updateWatch from '../../features/update-watch';
import AccountPageShell from '../design-system/AccountPageShell';
import NotificationSettings from '../design-system/NotificationSettings';
import WatchItemCard from '../design-system/WatchItemCard';

const AUTH_OPTIONS = {
    audience: 'https://fyndmaskinen.se',
    scope: 'read:users email read:current_user',
};

const Profile = () => {
    const {
        getAccessTokenSilently,
        logout,
        user,
    } = useAuth0();
    const [
        accessToken, setAccessToken,
    ] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        getAccessTokenSilently({
            authorizationParams: AUTH_OPTIONS,
        })
            .then(setAccessToken)
            .catch(console.error);
    }, [ getAccessTokenSilently ]);

    const {
        data: watches,
        isFetching,
    } = useQuery([
        'watches',
        accessToken,
    ], getWatches, {
        enabled: Boolean(accessToken),
        placeholderData: [],
        refetchOnWindowFocus: false,
    });
    const {
        data: watchLimit,
    } = useQuery([
        'watchLimit',
        accessToken,
    ], getWatchLimit, {
        enabled: Boolean(accessToken),
        placeholderData: 0,
        refetchOnWindowFocus: false,
    });
    const removeMutation = useMutation((match) => {
        return removeWatch(accessToken, match);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('watches');
        },
    });
    const editMutation = useMutation(({
        filters,
        match,
    }) => {
        return updateWatch({
            accessToken,
            filters,
            match,
            notificationEmail: user?.email,
        });
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('watches');
        },
    });

    const handleWatchDelete = useCallback((match) => {
        removeMutation.mutate(match);
    }, [ removeMutation ]);
    const handleWatchEdit = useCallback((match, filters) => {
        editMutation.mutate({
            filters,
            match,
        });
    }, [ editMutation ]);
    const handleLogout = useCallback(() => {
        return logout({
            returnTo: window.location.origin,
        });
    }, [ logout ]);

    return (
        <AccountPageShell
            description = 'Spara sökningar och få koll när nya fynd dyker upp.'
            title = 'Dina bevakningar'
        >
            <Stack
                spacing = {3}
            >
                <Stack
                    alignItems = 'center'
                    direction = 'row'
                    justifyContent = 'space-between'
                >
                    <Typography
                        variant = 'h6'
                    >
                        {'Aktiva bevakningar'}
                    </Typography>
                    <Typography
                        color = 'text.secondary'
                    >
                        {watchLimit
                            ? `${watches.length}/${watchLimit}`
                            : (
                                <Skeleton
                                    width = {40}
                                />
                            )}
                    </Typography>
                </Stack>
                {isFetching && watches.length === 0 && (
                    <Typography
                        color = 'text.secondary'
                        role = 'status'
                    >
                        {'Hämtar bevakningar…'}
                    </Typography>
                )}
                {!isFetching && watches.length === 0 && (
                    <Card
                        variant = 'outlined'
                    >
                        <CardContent
                            sx = {{
                                '&:last-child': {
                                    paddingBottom: 3,
                                },
                                padding: 3,
                            }}
                        >
                            <Typography
                                color = 'text.secondary'
                                textAlign = 'center'
                            >
                                {'Du har inga aktiva bevakningar ännu.'}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
                <Stack
                    spacing = {1}
                >
                    {watches.map((watch) => {
                        return (
                            <WatchItemCard
                                isSaving = {editMutation.isLoading}
                                key = {watch.match}
                                match = {watch.match}
                                maxPrice = {watch.maxPrice}
                                onDelete = {handleWatchDelete}
                                onEditSave = {handleWatchEdit}
                                sources = {watch.sources}
                            />
                        );
                    })}
                </Stack>
                <NotificationSettings />
                <Stack
                    direction = {{
                        sm: 'row',
                        xs: 'column',
                    }}
                    spacing = {1.5}
                >
                    <Button
                        href = {`${window.PURCHASE_URL}?prefilled_email=${user?.email}`}
                        variant = 'outlined'
                    >
                        {'Köp fler bevakningar'}
                    </Button>
                    <Button
                        href = {window.PORTAL_URL}
                        variant = 'outlined'
                    >
                        {'Hantera betalningar'}
                    </Button>
                    <Button
                        onClick = {handleLogout}
                        startIcon = {<LogoutIcon />}
                        variant = 'text'
                    >
                        {'Logga ut'}
                    </Button>
                </Stack>
            </Stack>
        </AccountPageShell>
    );
};

export default Profile;
