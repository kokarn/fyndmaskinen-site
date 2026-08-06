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
import MenuBookIcon from '@mui/icons-material/MenuBook';

import sources from '../../sources';
import AppShell from '../design-system/AppShell';
import AccountActions from '../design-system/AccountActions';
import Brand from '../design-system/Brand';
import DealTable from '../design-system/DealTable';
import DesignSection from '../design-system/DesignSection';
import DesignSwatch from '../design-system/DesignSwatch';
import FeatureLinkCard from '../design-system/FeatureLinkCard';
import FilterDrawer from '../design-system/FilterDrawer';
import FilterPanel from '../design-system/FilterPanel';
import IsbnQualityList from '../design-system/IsbnQualityList';
import LandingCoverage from '../design-system/LandingCoverage';
import LandingHero from '../design-system/LandingHero';
import NotificationBell from '../design-system/NotificationBell';
import NotificationCard from '../design-system/NotificationCard';
import NotificationSettings from '../design-system/NotificationSettings';
import PageContainer from '../design-system/PageContainer';
import ResultCard from '../design-system/ResultCard';
import SearchBox from '../design-system/SearchBox';
import SearchLoading from '../design-system/SearchLoading';
import SaveSearchButton from '../design-system/SaveSearchButton';
import SourceMark from '../design-system/SourceMark';
import StatisticCard from '../design-system/StatisticCard';
import WatchGroupCard from '../design-system/WatchGroupCard';
import WatchItemCard from '../design-system/WatchItemCard';
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
const SAMPLE_COUNTDOWN_MS = 3_600_000; // eslint-disable-line no-magic-numbers

const DesignSystem = () => {
    const [
        searchedFor,
        setSearchedFor,
    ] = useState('');
    const [
        maxPrice,
        setMaxPrice,
    ] = useState('2000');
    const [
        sort,
        setSort,
    ] = useState('relevance');
    const [
        sourceState,
        setSourceState,
    ] = useState(() => {
        return Object.fromEntries(sources.map((source) => {
            return [
                source.id, true,
            ];
        }));
    });
    const handleSearch = useCallback((value) => {
        setSearchedFor(value);
    }, []);
    const handleMaxPriceChange = useCallback((event) => {
        setMaxPrice(event.target.value);
    }, []);
    const handleSortChange = useCallback((event) => {
        setSort(event.target.value);
    }, []);
    const handleSourceChange = useCallback((event) => {
        const sourceId = event.target.value;

        setSourceState((previous) => {
            return {
                ...previous,
                [ sourceId ]: !previous[ sourceId ],
            };
        });
    }, []);
    const handleApply = useCallback(() => {
        setSearchedFor((previous) => {
            return previous;
        });
    }, []);
    const handleReset = useCallback(() => {
        setMaxPrice('');
        setSort('relevance');
        setSourceState(Object.fromEntries(sources.map((source) => {
            return [
                source.id, true,
            ];
        })));
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
                    backgroundColor: 'surface.hero',
                    borderBottom: '1px solid',
                    borderColor: 'border.subtle',
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
                                border: '1px solid',
                                borderColor: 'border.strong',
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
                        description = 'Riktiga Auth0- och bevakningsåtgärder, inte dekorativa kontroller.'
                        title = 'Konto och bevakningar'
                    >
                        <Stack
                            alignItems = 'flex-start'
                            spacing = {2}
                        >
                            <AccountActions />
                            <NotificationBell />
                            <SaveSearchButton
                                searchPhrase = 'designklassiker'
                            />
                            <NotificationCard
                                notification = {{
                                    createdAt: '2026-08-01T10:30:00.000Z',
                                    id: 'example-notification',
                                    imageUrl: 'https://fyndmaskinen.se/images/no-image.jpg',
                                    itemDescription: 'Ett exempel på en ny träff från en sparad bevakning.',
                                    itemTitle: 'Ny träff: Stringhylla i teak',
                                    itemUrl: '#notification-card',
                                    read: false,
                                    watchMatch: 'stringhylla',
                                }}
                                onOpen = {handleApply}
                            />
                            <NotificationSettings />
                        </Stack>
                    </DesignSection>
                    <DesignSection
                        description = 'Samma navigations- och statistikmönster används av adminverktygen.'
                        title = 'Verktyg och statistik'
                    >
                        <Grid
                            container
                            spacing = {2}
                        >
                            <Grid
                                item
                                md = {6}
                                xs = {12}
                            >
                                <FeatureLinkCard
                                    description = 'Jämför auktionspriser med Bokbörsen.'
                                    icon = {MenuBookIcon}
                                    label = 'ISBN-fyndkollen'
                                    to = '/deals/isbn'
                                />
                            </Grid>
                            <Grid
                                item
                                md = {3}
                                xs = {6}
                            >
                                <StatisticCard
                                    label = 'Tradera'
                                    mark = {
                                        <SourceMark
                                            compact
                                            label = 'Tradera'
                                            sourceId = 'tradera'
                                        />
                                    }
                                    value = '12 540'
                                />
                            </Grid>
                        </Grid>
                    </DesignSection>
                    <DesignSection
                        description = 'Bevakningar visas konsekvent på profil- och adminsidor.'
                        title = 'Bevakningskort'
                    >
                        <Stack
                            spacing = {2}
                        >
                            <WatchItemCard
                                match = 'stringhylla'
                            />
                            <WatchGroupCard
                                label = 'exempel@fyndmaskinen.se'
                                watches = {[
                                    'stringhylla',
                                    'designklassiker',
                                ]}
                            />
                        </Stack>
                    </DesignSection>
                    <DesignSection
                        description = 'Tabeller för matchande fynd och annonser utan säker värdering.'
                        title = 'Fyndtabell'
                    >
                        <DealTable
                            items = {[
                                {
                                    bid: 250,
                                    matcher: 'exempel',
                                    startTime: Date.now() + SAMPLE_COUNTDOWN_MS,
                                    title: 'Exempel på matchande auktionsfynd',
                                    url: 'https://fyndmaskinen.se/deals',
                                    value: 900,
                                },
                            ]}
                            type = 'matching'
                        />
                    </DesignSection>
                    <DesignSection
                        description = 'Lägsta pris per skick för en skannad ISBN. Tiers sorteras från bäst till sämst; okänt skick tonas ned.'
                        title = 'ISBN – pris per skick'
                    >
                        <Box
                            sx = {{
                                maxWidth: 420,
                            }}
                        >
                            <IsbnQualityList
                                conditions = {[
                                    {
                                        count: 4,
                                        id: 'nyskick',
                                        label: 'Nyskick',
                                        lowestPrice: 149,
                                    },
                                    {
                                        count: 7,
                                        id: 'mycket-gott',
                                        label: 'Mycket gott skick',
                                        lowestPrice: 99,
                                    },
                                    {
                                        count: 9,
                                        id: 'gott',
                                        label: 'Gott skick',
                                        lowestPrice: 69,
                                    },
                                    {
                                        count: 2,
                                        id: 'acceptabelt',
                                        label: 'Acceptabelt skick',
                                        lowestPrice: 39,
                                    },
                                    {
                                        count: 1,
                                        id: 'ej-angivet',
                                        label: 'Skick ej angivet',
                                        lowestPrice: 59,
                                    },
                                ]}
                                listingCount = {23}
                            />
                        </Box>
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
                        description = 'Produktens faktiska varumärke och landningshero. Ändringar här slår igenom i V2.'
                        title = 'Varumärke och landningshero'
                    >
                        <Stack
                            spacing = {3}
                        >
                            <Brand />
                            <LandingHero
                                onSearch = {handleSearch}
                            />
                            <LandingCoverage
                                auctionHouseCount = {138}
                                sources = {sources}
                            />
                        </Stack>
                    </DesignSection>
                    <DesignSection
                        description = 'Samma filterpanel används på desktop och i mobilens drawer.'
                        title = 'Filter'
                    >
                        <Box
                            sx = {{
                                maxWidth: 360,
                            }}
                        >
                            <FilterPanel
                                maxPrice = {maxPrice}
                                onApply = {handleApply}
                                onMaxPriceChange = {handleMaxPriceChange}
                                onReset = {handleReset}
                                onSortChange = {handleSortChange}
                                onSourceChange = {handleSourceChange}
                                sort = {sort}
                                sourceState = {sourceState}
                                sources = {sources}
                            />
                            <Box
                                sx = {{
                                    marginTop: 2,
                                }}
                            >
                                <FilterDrawer
                                    filterProps = {{
                                        maxPrice,
                                        onMaxPriceChange: handleMaxPriceChange,
                                        onReset: handleReset,
                                        onSortChange: handleSortChange,
                                        onSourceChange: handleSourceChange,
                                        sort,
                                        sources,
                                        sourceState,
                                    }}
                                    label = 'Öppna filterpanel'
                                />
                            </Box>
                        </Box>
                    </DesignSection>
                    <DesignSection
                        description = 'Visas medan en sökning eller filterändring hämtar nya resultat.'
                        title = 'Laddning'
                    >
                        <SearchLoading />
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

