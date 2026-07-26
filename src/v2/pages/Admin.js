import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Link,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import sources from '../../sources';
import AccountPageShell from '../design-system/AccountPageShell';
import SourceMark from '../design-system/SourceMark';

const STALE_TIME = 300000;
const adminLinks = [
    {
        description: 'Jämför auktionspriser med Bokbörsen.',
        icon: MenuBookIcon,
        label: 'ISBN-fyndkollen',
        to: '/deals/isbn',
    },
    {
        description: 'Skanna streckkoder och sök upp ISBN.',
        icon: QrCodeScannerIcon,
        label: 'ISBN-skanner',
        to: '/barcode',
    },
    {
        description: 'Se bevakningar från alla användare.',
        icon: NotificationsActiveIcon,
        label: 'Alla bevakningar',
        to: '/admin/watches',
    },
];

const fetchItemCounts = ({
    queryKey,
}) => {
    const accessToken = queryKey[ 1 ];
    const query = '{ getItemCountsByType { type count } }';

    if (!accessToken) {
        return [];
    }

    return fetch(`${window.API_HOSTNAME}/graphql`, {
        body: JSON.stringify({
            query,
        }),
        headers: {
            authorization: [
                'Bearer', accessToken,
            ].join(' '),
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            if (response?.errors?.length && !response?.data?.getItemCountsByType) {
                throw new Error(response.errors[ 0 ].message);
            }

            return (response?.data?.getItemCountsByType ?? []).filter(Boolean);
        });
};

const getSourceForType = (type) => {
    return sources.find((source) => {
        return source.ids
            ? source.ids.includes(type)
            : source.id === type;
    });
};

const Admin = () => {
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
        data: itemCounts,
        isFetching,
    } = useQuery([
        'item-counts',
        accessToken,
    ], fetchItemCounts, {
        enabled: Boolean(accessToken),
        placeholderData: [],
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME,
    });
    const sortedCounts = [ ...itemCounts ].sort((a, b) => {
        return a.type.localeCompare(b.type);
    });

    return (
        <AccountPageShell
            description = 'Interna verktyg och status för Fyndmaskinen.'
            title = 'Admin'
        >
            <Stack
                spacing = {5}
            >
                <Grid
                    container
                    spacing = {2}
                >
                    {adminLinks.map((link) => {
                        return (
                            <Grid
                                key = {link.to}
                                md = {4}
                                xs = {12}
                            >
                                <Card
                                    sx = {{
                                        height: '100%',
                                    }}
                                >
                                    <CardActionArea
                                        component = {Link}
                                        sx = {{
                                            height: '100%',
                                        }}
                                        to = {link.to}
                                    >
                                        <CardContent>
                                            <Stack
                                                alignItems = 'flex-start'
                                                spacing = {2}
                                            >
                                                <link.icon
                                                    color = 'primary'
                                                    sx = {{
                                                        fontSize: 36,
                                                    }}
                                                />
                                                <Box>
                                                    <Typography
                                                        variant = 'h6'
                                                    >
                                                        {link.label}
                                                    </Typography>
                                                    <Typography
                                                        color = 'text.secondary'
                                                        variant = 'body2'
                                                    >
                                                        {link.description}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
                <Box>
                    <Typography
                        sx = {{
                            marginBottom: 2,
                        }}
                        variant = 'h5'
                    >
                        {'Objekt i databasen'}
                    </Typography>
                    {isFetching && itemCounts.length === 0 && (
                        <CircularProgress
                            size = {24}
                        />
                    )}
                    <Grid
                        container
                        spacing = {1.5}
                    >
                        {sortedCounts.map((item) => {
                            const source = getSourceForType(item.type);

                            return (
                                <Grid
                                    key = {item.type}
                                    lg = {3}
                                    sm = {4}
                                    xs = {6}
                                >
                                    <Card
                                        variant = 'outlined'
                                    >
                                        <CardContent>
                                            <Stack
                                                alignItems = 'center'
                                                direction = 'row'
                                                spacing = {1.5}
                                            >
                                                {source && (
                                                    <SourceMark
                                                        compact
                                                        label = {source.label}
                                                        sourceId = {source.id}
                                                    />
                                                )}
                                                <Box>
                                                    <Typography
                                                        color = 'text.secondary'
                                                        variant = 'caption'
                                                    >
                                                        {source?.label || item.type}
                                                    </Typography>
                                                    <Typography
                                                        sx = {{
                                                            fontWeight: 800,
                                                        }}
                                                        variant = 'body1'
                                                    >
                                                        {new Intl.NumberFormat('sv-SE').format(item.count)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Stack>
        </AccountPageShell>
    );
};

export default Admin;
