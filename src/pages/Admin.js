import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Alert,
    Box,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';

import {
    useQuery,
} from 'react-query';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import sources from '../sources';
import AccountPageShell from '../design-system/AccountPageShell';
import FeatureLinkCard from '../design-system/FeatureLinkCard';
import SourceMark from '../design-system/SourceMark';
import StatisticCard from '../design-system/StatisticCard';

const STALE_TIME = 300000;
const AUTH_OPTIONS = {
    audience: 'https://fyndmaskinen.se',
    scope: 'read:users email read:current_user',
};
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
            authorizationParams: AUTH_OPTIONS,
        })
            .then(setAccessToken)
            .catch(console.error);
    }, [ getAccessTokenSilently ]);

    const {
        data: itemCounts = [],
        error: itemCountsError,
        isError,
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
                <Box
                    sx = {{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            md: 'repeat(3, minmax(0, 1fr))',
                            xs: 'minmax(0, 1fr)',
                        },
                        width: '100%',
                    }}
                >
                    {adminLinks.map((link) => {
                        return (
                            <Box
                                key = {link.to}
                            >
                                <FeatureLinkCard
                                    description = {link.description}
                                    icon = {link.icon}
                                    label = {link.label}
                                    to = {link.to}
                                />
                            </Box>
                        );
                    })}
                </Box>
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
                    {isError && (
                        <Alert
                            severity = 'warning'
                            sx = {{
                                marginBottom: 2,
                            }}
                        >
                            {itemCountsError?.message || 'Kunde inte hämta databasstatistik.'}
                        </Alert>
                    )}
                    <Box
                        sx = {{
                            display: 'grid',
                            gap: 1.5,
                            gridTemplateColumns: {
                                lg: 'repeat(4, minmax(0, 1fr))',
                                sm: 'repeat(2, minmax(0, 1fr))',
                                xs: 'minmax(0, 1fr)',
                            },
                            width: '100%',
                        }}
                    >
                        {sortedCounts.map((item) => {
                            const source = getSourceForType(item.type);

                            return (
                                <Box
                                    key = {item.type}
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
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Stack>
        </AccountPageShell>
    );
};

export default Admin;
