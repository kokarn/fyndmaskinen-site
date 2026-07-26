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
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Link,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';
import {
    Helmet,
} from 'react-helmet';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import sources from '../../sources';

const STALE_TIME = 300000;

const adminLinks = [
    {
        description: 'Hitta felprissatta böcker genom att jämföra auktionspriser med Bokbörsen.',
        icon: MenuBookIcon,
        label: 'ISBN-fyndkollen',
        to: '/deals/isbn',
    },
    {
        description: 'Skanna streckkoder och sök upp ISBN direkt.',
        icon: QrCodeScannerIcon,
        label: 'ISBN-skanner',
        to: '/barcode',
    },
    {
        description: 'Se alla bevakningar från alla användare.',
        icon: NotificationsActiveIcon,
        label: 'Alla bevakningar',
        to: '/admin/watches',
    },
];

const fetchItemCounts = ({
    queryKey,
}) => {
    const accessToken = queryKey[ 1 ];

    if (!accessToken) {
        return [];
    }

    const query = `{
        getItemCountsByType {
            type
            count
        }
    }`;

    return fetch(`${window.API_HOSTNAME}/graphql`, {
        body: JSON.stringify({
            query,
        }),
        headers: {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            if (response?.errors?.length > 0 && !response?.data?.getItemCountsByType) {
                throw new Error(response.errors[ 0 ].message);
            }

            return (response?.data?.getItemCountsByType ?? []).filter(Boolean);
        });
};

const getSourceForType = (type) => {
    return sources.find((source) => {
        if (source.ids) {
            return source.ids.includes(type);
        }

        return source.id === type;
    });
};

const formatCount = (count) => {
    return new Intl.NumberFormat('sv-SE').format(count);
};

const Admin = () => {
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
        data: itemCounts,
        isFetching,
    } = useQuery([
        'item-counts',
        accessToken,
    ], fetchItemCounts, {
        enabled: Boolean(accessToken),
        placeholderData: [],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME,
    });

    const sortedCounts = [ ...itemCounts ].sort((a, b) => {
        return a.type.localeCompare(b.type);
    });

    return (
        <Box
            sx = {{
                marginTop: 4,
            }}
        >
            <Helmet>
                <title>
                    {'Admin'}
                </title>
            </Helmet>
            <Typography
                color = '#fff'
                sx = {{
                    marginBottom: 3,
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
                variant = 'h4'
            >
                {'Admin'}
            </Typography>
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
                            <Card>
                                <CardActionArea
                                    component = {Link}
                                    to = {link.to}
                                >
                                    <CardContent
                                        sx = {{
                                            alignItems: 'center',
                                            display: 'flex',
                                            gap: 2,
                                        }}
                                    >
                                        <link.icon
                                            color = 'primary'
                                            sx = {{
                                                fontSize: 40,
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
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <Typography
                color = '#fff'
                sx = {{
                    marginBottom: 2,
                    marginTop: 5,
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
                variant = 'h5'
            >
                {'Objekt i databasen'}
            </Typography>
            {isFetching && itemCounts.length === 0 && (
                <CircularProgress
                    size = {24}
                    sx = {{
                        color: '#fff',
                    }}
                />
            )}
            {sortedCounts.length > 0 && (
                <Box
                    sx = {{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                    }}
                >
                    {sortedCounts.map((item) => {
                        const source = getSourceForType(item.type);
                        const hasMultipleIds = source?.ids?.length > 1;
                        const label = source?.label || item.type;

                        return (
                            <Card
                                key = {item.type}
                                sx = {{
                                    flex: '1 1 auto',
                                    minWidth: 110,
                                }}
                            >
                                <CardContent
                                    sx = {{
                                        '&:last-child': {
                                            paddingBottom: 1,
                                        },
                                        display: 'flex',
                                        gap: 1,
                                        padding: 1,
                                    }}
                                >
                                    {source && (
                                        <Box
                                            sx = {{
                                                '& > *': {
                                                    margin: '0 !important',
                                                },
                                                display: 'flex',
                                                flexShrink: 0,
                                                paddingTop: '3px',
                                                width: 20,
                                            }}
                                        >
                                            {source.icon}
                                        </Box>
                                    )}
                                    <Box>
                                        <Typography
                                            color = 'text.secondary'
                                            component = 'div'
                                            sx = {{
                                                fontSize: '0.65rem',
                                                lineHeight: 1.2,
                                            }}
                                            variant = 'caption'
                                        >
                                            {label}
                                            {hasMultipleIds && (
                                                <Typography
                                                    color = 'text.disabled'
                                                    component = 'span'
                                                    sx = {{
                                                        fontSize: '0.6rem',
                                                        marginLeft: '4px',
                                                    }}
                                                    variant = 'caption'
                                                >
                                                    {item.type}
                                                </Typography>
                                            )}
                                        </Typography>
                                        <Typography
                                            sx = {{
                                                fontWeight: 600,
                                                lineHeight: 1.2,
                                            }}
                                            variant = 'body2'
                                        >
                                            {formatCount(item.count)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default Admin;
