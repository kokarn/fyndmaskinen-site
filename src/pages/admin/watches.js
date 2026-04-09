import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Box,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {
    useQuery,
} from 'react-query';
import {
    Link,
} from 'react-router-dom';
import {
    Helmet,
} from 'react-helmet';

import getAllWatches from '../../features/get-all-watches';

const STALE_TIME = 600000;

const AdminWatches = () => {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const [
        accessToken,
        setAccessToken,
    ] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const token = await getAccessTokenSilently({
                    audience: 'https://fyndmaskinen.se',
                    scope: 'read:users email read:current_user',
                });

                setAccessToken(token);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const {
        data: watches,
        isFetching,
    } = useQuery([
        'all-watches',
        accessToken,
    ], getAllWatches, {
        enabled: Boolean(accessToken),
        placeholderData: [],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME,
    });

    const groupedByUser = watches.reduce((acc, watch) => {
        if (!acc[ watch.notify ]) {
            acc[ watch.notify ] = [];
        }

        acc[ watch.notify ].push(watch.match);

        return acc;
    }, {});

    const users = Object.keys(groupedByUser).sort();

    return (
        <Box
            sx = {{
                marginTop: 4,
            }}
        >
            <Helmet>
                <title>
                    {'Alla bevakningar — Admin'}
                </title>
            </Helmet>
            <Typography
                color = '#fff'
                sx = {{
                    marginBottom: 1,
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
                variant = 'h4'
            >
                {'Alla bevakningar'}
            </Typography>
            <Typography
                color = '#fff'
                sx = {{
                    marginBottom: 3,
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
                variant = 'body1'
            >
                {isFetching
                    ? 'Laddar...'
                    : `${watches.length} bevakningar från ${users.length} användare`}
            </Typography>
            {isFetching && watches.length === 0 && (
                <Box
                    sx = {{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <CircularProgress
                        size = {24}
                    />
                    <Typography
                        color = '#fff'
                        variant = 'body1'
                    >
                        {'Hämtar bevakningar...'}
                    </Typography>
                </Box>
            )}
            {users.length > 0 && (
                <TableContainer
                    sx = {{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 2,
                        marginBottom: 4,
                    }}
                >
                    <Table
                        size = 'small'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {'Användare'}
                                </TableCell>
                                <TableCell
                                    align = 'right'
                                >
                                    {'Antal'}
                                </TableCell>
                                <TableCell>
                                    {'Bevakningar'}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((email) => {
                                const userWatches = groupedByUser[ email ];

                                return (
                                    <TableRow
                                        hover
                                        key = {email}
                                    >
                                        <TableCell>
                                            <Typography
                                                variant = 'body2'
                                            >
                                                {email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            align = 'right'
                                        >
                                            {userWatches.length}
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx = {{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {userWatches.map((match) => {
                                                    return (
                                                        <Chip
                                                            clickable
                                                            component = {Link}
                                                            key = {match}
                                                            label = {match}
                                                            size = 'small'
                                                            to = {`/search/${encodeURIComponent(match)}`}
                                                            variant = 'outlined'
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminWatches;
