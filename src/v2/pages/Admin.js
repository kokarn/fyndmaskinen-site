import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Box,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    useQuery,
} from 'react-query';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import sources from '../../sources';
import AccountPageShell from '../design-system/AccountPageShell';
import FeatureLinkCard from '../design-system/FeatureLinkCard';
import SourceMark from '../design-system/SourceMark';
import StatisticCard from '../design-system/StatisticCard';

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
                                <FeatureLinkCard
                                    description = {link.description}
                                    icon = {link.icon}
                                    label = {link.label}
                                    to = {link.to}
                                />
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
                                    <StatisticCard
                                        label = {source?.label || item.type}
                                        mark = {source
                                            ? (
                                                <SourceMark
                                                    compact
                                                    label = {source.label}
                                                    sourceId = {source.id}
                                                />
                                            )
                                            : null}
                                        value = {new Intl.NumberFormat('sv-SE').format(item.count)}
                                    />
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
