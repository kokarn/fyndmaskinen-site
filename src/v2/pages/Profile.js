import {
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import {
    Link,
} from 'react-router-dom';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from 'react-query';

import addWatch from '../../features/add-watch';
import getWatches from '../../features/get-watches';
import getWatchLimit from '../../features/get-watch-limit';
import removeWatch from '../../features/remove-watch';
import AccountPageShell from '../design-system/AccountPageShell';

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
    const [
        newWatch, setNewWatch,
    ] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        getAccessTokenSilently(AUTH_OPTIONS)
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
    const addMutation = useMutation(() => {
        return addWatch(accessToken, user.email, newWatch.trim());
    }, {
        onSuccess: () => {
            setNewWatch('');
            queryClient.invalidateQueries('watches');
        },
    });
    const removeMutation = useMutation((match) => {
        return removeWatch(accessToken, match);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('watches');
        },
    });
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        if (newWatch.trim()) {
            addMutation.mutate();
        }
    }, [
        addMutation, newWatch,
    ]);
    const handleNewWatchChange = useCallback((event) => {
        setNewWatch(event.target.value);
    }, []);
    const handleWatchDelete = useCallback((event) => {
        removeMutation.mutate(event.currentTarget.dataset.match);
    }, [ removeMutation ]);
    const handleLogout = useCallback(() => {
        return logout({
            returnTo: window.location.origin,
        });
    }, [ logout ]);
    const atLimit = Boolean(watchLimit && watches.length >= watchLimit);

    return (
        <AccountPageShell
            description = 'Spara sökningar och få koll när nya fynd dyker upp.'
            title = 'Dina bevakningar'
        >
            <Stack
                spacing = {3}
            >
                <Card>
                    <CardContent>
                        <Box
                            component = 'form'
                            onSubmit = {handleSubmit}
                        >
                            <Stack
                                alignItems = {{
                                    sm: 'flex-start',
                                }}
                                direction = {{
                                    sm: 'row',
                                    xs: 'column',
                                }}
                                spacing = {1.5}
                            >
                                <TextField
                                    disabled = {atLimit}
                                    fullWidth
                                    label = 'Ny bevakning'
                                    onChange = {handleNewWatchChange}
                                    placeholder = 'Till exempel: stringhylla'
                                    value = {newWatch}
                                />
                                <Button
                                    disabled = {atLimit || addMutation.isLoading || !newWatch.trim()}
                                    startIcon = {<SearchIcon />}
                                    type = 'submit'
                                    variant = 'contained'
                                >
                                    {'Lägg till'}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
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
                        <CardContent>
                            <Typography
                                color = 'text.secondary'
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
                            <Card
                                key = {watch.match}
                                variant = 'outlined'
                            >
                                <CardContent
                                    sx = {{
                                        '&:last-child': {
                                            paddingBottom: 2,
                                        },
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: 2,
                                    }}
                                >
                                    <Typography
                                        component = {Link}
                                        sx = {{
                                            color: 'text.primary',
                                            fontWeight: 800,
                                            textDecoration: 'none',
                                        }}
                                        to = {`/v2/search/${encodeURIComponent(watch.match)}`}
                                    >
                                        {watch.match}
                                    </Typography>
                                    <Button
                                        aria-label = {`Ta bort bevakningen ${watch.match}`}
                                        color = 'secondary'
                                        data-match = {watch.match}
                                        onClick = {handleWatchDelete}
                                        startIcon = {<DeleteOutlineIcon />}
                                        variant = 'text'
                                    >
                                        {'Ta bort'}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
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
