import {
    useCallback,
} from 'react';
import {
    useNavigate,
} from 'react-router-dom';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';
import {
    Helmet,
} from 'react-helmet';

import sources from '../../sources';
import AppShell from '../design-system/AppShell';
import PageContainer from '../design-system/PageContainer';
import SearchBox from '../design-system/SearchBox';
import SourceMark from '../design-system/SourceMark';
import {
    createV2SearchPath,
} from '../search-state';

const Home = () => {
    const navigate = useNavigate();
    const handleSearch = useCallback((searchPhrase) => {
        navigate(createV2SearchPath(searchPhrase));
    }, [ navigate ]);

    return (
        <AppShell>
            <Helmet>
                <title>
                    {'Fyndmaskinen – sök hela andrahandsmarknaden'}
                </title>
            </Helmet>
            <Box
                sx = {{
                    backgroundColor: 'secondary.light',
                    backgroundImage: 'radial-gradient(circle at 90% 0%, rgba(255,255,255,.45), transparent 28%)',
                    paddingBottom: {
                        md: 9,
                        xs: 4.5,
                    },
                    paddingTop: {
                        md: 8,
                        xs: 3.5,
                    },
                }}
            >
                <PageContainer
                    sx = {{
                        maxWidth: 1120,
                    }}
                >
                    <Stack
                        alignItems = 'center'
                        spacing = {{
                            sm: 3,
                            xs: 2,
                        }}
                        textAlign = 'center'
                    >
                        <Typography
                            sx = {{
                                backgroundColor: 'rgba(46, 138, 108, 0.1)',
                                borderRadius: 10,
                                color: '#246D58',
                                fontSize: '0.78rem',
                                fontWeight: 850,
                                letterSpacing: '0.06em',
                                paddingX: 2,
                                paddingY: 0.8,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {'ALLA MARKNADSPLATSER. EN SÖKNING.'}
                        </Typography>
                        <Typography
                            component = 'h1'
                            maxWidth = {860}
                            variant = 'h1'
                        >
                            {'En sökning. Hela andrahandsmarknaden.'}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                            fontSize = {{
                                sm: '1.1rem',
                                xs: '1rem',
                            }}
                        >
                            {'Sök samtidigt på Blocket, Tradera, Auctionet och fler.'}
                        </Typography>
                        <Box
                            sx = {{
                                maxWidth: 1050,
                                paddingTop: 1,
                                width: '100%',
                            }}
                        >
                            <SearchBox
                                onSearch = {handleSearch}
                            />
                        </Box>
                    </Stack>
                </PageContainer>
            </Box>
            <PageContainer
                sx = {{
                    paddingBottom: 9,
                    paddingTop: {
                        sm: 5,
                        xs: 3.5,
                    },
                }}
            >
                <Typography
                    color = 'text.secondary'
                    fontSize = '0.75rem'
                    fontWeight = {850}
                    letterSpacing = '0.06em'
                    textAlign = 'center'
                >
                    {'SÖKER JUST NU HOS'}
                </Typography>
                <Stack
                    direction = 'row'
                    flexWrap = 'wrap'
                    gap = {1}
                    justifyContent = 'center'
                    marginTop = {2}
                >
                    {sources.map((source) => {
                        return (
                            <SourceMark
                                key = {source.id}
                                label = {source.label}
                                sourceId = {source.id}
                            />
                        );
                    })}
                </Stack>
                <Stack
                    marginTop = {{
                        sm: 8,
                        xs: 5,
                    }}
                    spacing = {1}
                    textAlign = 'center'
                >
                    <Typography
                        component = 'h2'
                        variant = 'h2'
                    >
                        {'Ett sökresultat – oavsett källa'}
                    </Typography>
                    <Typography
                        color = 'text.secondary'
                    >
                        {'Jämför objekt och priser utan att hoppa mellan olika sajter.'}
                    </Typography>
                </Stack>
            </PageContainer>
        </AppShell>
    );
};

export default Home;
