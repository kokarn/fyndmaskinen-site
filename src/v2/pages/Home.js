import {
    useCallback,
} from 'react';
import {
    useNavigate,
} from 'react-router-dom';
import {
    Stack,
    Typography,
} from '@mui/material';
import {
    Helmet,
} from 'react-helmet';

import sources from '../../sources';
import AppShell from '../design-system/AppShell';
import LandingHero from '../design-system/LandingHero';
import PageContainer from '../design-system/PageContainer';
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
            <LandingHero
                onSearch = {handleSearch}
            />
            <PageContainer
                sx = {{
                    paddingBottom: {
                        sm: 8,
                        xs: 5,
                    },
                    paddingTop: {
                        sm: 5,
                        xs: 4,
                    },
                }}
            >
                <Stack
                    alignItems = 'center'
                    spacing = {2}
                >
                    <Typography
                        color = 'text.secondary'
                        fontSize = '0.75rem'
                        fontWeight = {850}
                        letterSpacing = '0.07em'
                        textAlign = 'center'
                    >
                        {'SÖKER HOS'}
                    </Typography>
                    <Stack
                        direction = 'row'
                        flexWrap = 'wrap'
                        gap = {1}
                        justifyContent = 'center'
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
                    <Typography
                        color = 'text.secondary'
                        fontSize = '0.9rem'
                        marginTop = {{
                            sm: 3,
                            xs: 2,
                        }}
                        maxWidth = {560}
                        textAlign = 'center'
                    >
                        {'Fyndmaskinen samlar resultaten på ett ställe. När du hittar något öppnas '
                            + 'originalannonsen hos marknadsplatsen.'}
                    </Typography>
                </Stack>
            </PageContainer>
        </AppShell>
    );
};

export default Home;
