import {
    useCallback,
    useState,
} from 'react';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {
    Helmet,
} from 'react-helmet';

import sources from '../../sources';
import AppShell from '../design-system/AppShell';
import DesignSection from '../design-system/DesignSection';
import DesignSwatch from '../design-system/DesignSwatch';
import PageContainer from '../design-system/PageContainer';
import ResultCard from '../design-system/ResultCard';
import SearchBox from '../design-system/SearchBox';
import SourceMark from '../design-system/SourceMark';
import {
    colors,
} from '../design-system/theme';

const sampleItem = {
    currentPrice: 1250,
    imageUrl: 'https://fyndmaskinen.se/images/no-image.jpg',
    title: 'Exempel på ett sökresultat med en titel i två rader',
    type: 'tradera',
    url: '#result-card',
};

const DesignSystem = () => {
    const [
        searchedFor,
        setSearchedFor,
    ] = useState('');
    const handleSearch = useCallback((value) => {
        setSearchedFor(value);
    }, []);

    return (
        <AppShell>
            <Helmet>
                <title>
                    {'Designsystem – Fyndmaskinen'}
                </title>
            </Helmet>
            <Box
                sx = {{
                    backgroundColor: 'secondary.light',
                    borderBottom: '1px solid rgba(18, 58, 51, 0.08)',
                    paddingY: {
                        sm: 7,
                        xs: 5,
                    },
                }}
            >
                <PageContainer>
                    <Typography
                        color = 'text.secondary'
                        fontSize = '0.78rem'
                        fontWeight = {850}
                        letterSpacing = '0.09em'
                    >
                        {'FYNDMASKINEN V2'}
                    </Typography>
                    <Typography
                        component = 'h1'
                        marginTop = {1.5}
                        variant = 'h1'
                    >
                        {'Designsystem'}
                    </Typography>
                    <Typography
                        color = 'text.secondary'
                        marginTop = {2}
                        maxWidth = {680}
                    >
                        {'Tokens and återanvändbara komponenter för en konsekvent sökupplevelse på mobil och desktop.'}
                    </Typography>
                </PageContainer>
            </Box>
            <PageContainer
                sx = {{
                    paddingBottom: 10,
                    paddingTop: {
                        sm: 7,
                        xs: 5,
                    },
                }}
            >
                <Stack
                    divider = {<Divider />}
                    spacing = {{
                        sm: 7,
                        xs: 5,
                    }}
                >
                    <DesignSection
                        description = 'Semantiska färger används genom temat i stället för sidspecifika hexvärden.'
                        title = 'Färg'
                    >
                        <Grid
                            container
                            spacing = {2}
                        >
                            {[
                                [
                                    'Bläck', colors.ink,
                                ],
                                [
                                    'Accent', colors.accent,
                                ],
                                [
                                    'Bakgrund', colors.background,
                                ],
                                [
                                    'Hero', colors.hero,
                                ],
                                [
                                    'Papper', colors.paper,
                                ],
                                [
                                    'Dämpad', colors.muted,
                                ],
                            ].map(([
                                label, color,
                            ]) => {
                                return (
                                    <Grid
                                        item
                                        key = {label}
                                        md = {2}
                                        sm = {4}
                                        xs = {6}
                                    >
                                        <DesignSwatch
                                            color = {color}
                                            label = {label}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </DesignSection>
                    <DesignSection
                        description = 'Georgia för stora rubriker och systemets sans-serif för gränssnitt och brödtext.'
                        title = 'Typografi'
                    >
                        <Paper
                            elevation = {0}
                            sx = {{
                                border: '1px solid rgba(18, 58, 51, 0.1)',
                                padding: {
                                    sm: 4,
                                    xs: 3,
                                },
                            }}
                        >
                            <Typography
                                variant = 'h1'
                            >
                                {'Hitta nästa fynd.'}
                            </Typography>
                            <Typography
                                marginTop = {3}
                                variant = 'h2'
                            >
                                {'Sökresultat'}
                            </Typography>
                            <Typography
                                color = 'text.secondary'
                                marginTop = {2}
                            >
                                {'Brödtext ska vara tydlig, kort och hjälpa användaren vidare.'}
                            </Typography>
                        </Paper>
                    </DesignSection>
                    <DesignSection
                        description = 'Sökfältet är den primära interaktionen och fungerar i båda brytpunkterna.'
                        title = 'Sökning och knappar'
                    >
                        <Stack
                            spacing = {2}
                        >
                            <SearchBox
                                onSearch = {handleSearch}
                            />
                            {searchedFor && (
                                <Typography
                                    color = 'text.secondary'
                                >
                                    {`Exempelsökning: ${searchedFor}`}
                                </Typography>
                            )}
                            <Stack
                                direction = 'row'
                                flexWrap = 'wrap'
                                gap = {1.5}
                            >
                                <Button
                                    variant = 'contained'
                                >
                                    {'Primär'}
                                </Button>
                                <Button
                                    variant = 'outlined'
                                >
                                    {'Sekundär'}
                                </Button>
                                <Button
                                    variant = 'text'
                                >
                                    {'Textknapp'}
                                </Button>
                            </Stack>
                        </Stack>
                    </DesignSection>
                    <DesignSection
                        description = 'Marknadsplatser representeras konsekvent i landning, filter och resultatkort.'
                        title = 'Marknadsplatser och status'
                    >
                        <Stack
                            direction = 'row'
                            flexWrap = 'wrap'
                            gap = {1}
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
                            <Chip
                                label = 'Max 2 000 kr'
                            />
                        </Stack>
                    </DesignSection>
                    <DesignSection
                        description = 'Kortet visar endast funktioner som finns: annons, pris och marknadsplats.'
                        title = 'Resultatkort'
                    >
                        <Box
                            sx = {{
                                maxWidth: 360,
                            }}
                        >
                            <ResultCard
                                item = {sampleItem}
                            />
                        </Box>
                    </DesignSection>
                </Stack>
            </PageContainer>
        </AppShell>
    );
};

export default DesignSystem;

