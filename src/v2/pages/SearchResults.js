import {
    useCallback,
    useState,
} from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Drawer,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Helmet,
} from 'react-helmet';

import sources from '../../sources';
import doSearch from '../../features/search';
import useDebounce from '../../hooks/useDebounce';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';
import AppShell from '../design-system/AppShell';
import FilterPanel from '../design-system/FilterPanel';
import PageContainer from '../design-system/PageContainer';
import ResultCard from '../design-system/ResultCard';
import SearchBox from '../design-system/SearchBox';
import {
    createV2SearchPath,
    getDefaultSourceState,
    getEnabledSourceIds,
} from '../search-state';

const SEARCH_DELAY = 200;

const SearchResults = () => {
    const {
        searchString = '',
    } = useParams();
    const searchPhrase = decodeURIComponent(searchString);
    const navigate = useNavigate();
    const [
        sourceState,
        setSourceState,
    ] = useStateWithLocalStorage('v2-sources', getDefaultSourceState(sources));
    const [
        maxPrice,
        setMaxPrice,
    ] = useState('');
    const [
        sort,
        setSort,
    ] = useState('relevance');
    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);
    const debouncedMaxPrice = useDebounce(maxPrice, SEARCH_DELAY);
    const enabledSourceIds = getEnabledSourceIds(sourceState, sources);
    const {
        data: searchResult = [],
        isFetching,
    } = useQuery([
        'v2-search',
        searchPhrase,
        enabledSourceIds,
        debouncedMaxPrice,
        sort,
    ], doSearch, {
        placeholderData: [],
        refetchOnWindowFocus: false,
    });
    const handleSearch = useCallback((value) => {
        navigate(createV2SearchPath(value));
    }, [ navigate ]);
    const handleSourceChange = useCallback((event) => {
        const sourceId = event.target.value;

        setSourceState((previous) => {
            return {
                ...previous,
                [ sourceId ]: !previous[ sourceId ],
            };
        });
    }, [ setSourceState ]);
    const handleMaxPriceChange = useCallback((event) => {
        setMaxPrice(event.target.value.replace(/[^0-9]/gu, ''));
    }, []);
    const handleSortChange = useCallback((event) => {
        setSort(event.target.value);
    }, []);
    const handleReset = useCallback(() => {
        setSourceState(getDefaultSourceState(sources));
        setMaxPrice('');
        setSort('relevance');
    }, [ setSourceState ]);
    const handleDrawerOpen = useCallback(() => {
        setDrawerOpen(true);
    }, []);
    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, []);
    const filterProps = {
        maxPrice,
        onMaxPriceChange: handleMaxPriceChange,
        onReset: handleReset,
        onSortChange: handleSortChange,
        onSourceChange: handleSourceChange,
        sort,
        sources,
        sourceState,
    };

    return (
        <AppShell>
            <Helmet>
                <title>
                    {`${searchPhrase} – Fyndmaskinen`}
                </title>
            </Helmet>
            <Box
                sx = {{
                    backgroundColor: 'surface.hero',
                    paddingY: {
                        sm: 3,
                        xs: 2,
                    },
                }}
            >
                <PageContainer>
                    <SearchBox
                        defaultValue = {searchPhrase}
                        onSearch = {handleSearch}
                    />
                </PageContainer>
            </Box>
            <PageContainer
                sx = {{
                    paddingBottom: 8,
                    paddingTop: {
                        sm: 5,
                        xs: 3,
                    },
                }}
            >
                <Stack
                    alignItems = {{
                        sm: 'center',
                        xs: 'flex-start',
                    }}
                    direction = {{
                        sm: 'row',
                        xs: 'column',
                    }}
                    justifyContent = 'space-between'
                    spacing = {2}
                >
                    <Box>
                        <Typography
                            component = 'h1'
                            variant = 'h2'
                        >
                            {`${searchResult.length} fynd för “${searchPhrase}”`}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                        >
                            {`Resultat från ${enabledSourceIds.length} marknadsplatser`}
                        </Typography>
                    </Box>
                    <Button
                        fullWidth
                        onClick = {handleDrawerOpen}
                        startIcon = {<FilterListIcon />}
                        sx = {{
                            display: {
                                md: 'none',
                            },
                        }}
                        variant = 'outlined'
                    >
                        {'Filter'}
                    </Button>
                </Stack>
                <Grid
                    container
                    marginTop = {{
                        sm: 3,
                        xs: 1,
                    }}
                    spacing = {{
                        md: 3,
                        xs: 2,
                    }}
                >
                    <Grid
                        item
                        md = {3}
                        sx = {{
                            display: {
                                md: 'block',
                                xs: 'none',
                            },
                        }}
                    >
                        <FilterPanel
                            {...filterProps}
                        />
                    </Grid>
                    <Grid
                        item
                        md = {9}
                        xs = {12}
                    >
                        <Stack
                            direction = 'row'
                            flexWrap = 'wrap'
                            gap = {1}
                            marginBottom = {2.5}
                        >
                            {maxPrice && (
                                <Chip
                                    label = {`Max ${maxPrice} kr`}
                                />
                            )}
                            {sort !== 'relevance' && (
                                <Chip
                                    label = {sort === 'price_asc'
                                        ? 'Lägsta pris'
                                        : 'Högsta pris'}
                                />
                            )}
                        </Stack>
                        {isFetching && (
                            <Stack
                                alignItems = 'center'
                                padding = {8}
                            >
                                <CircularProgress />
                            </Stack>
                        )}
                        {!isFetching && (
                            <Grid
                                container
                                spacing = {{
                                    sm: 2.5,
                                    xs: 1.5,
                                }}
                            >
                                {searchResult.map((item) => {
                                    return (
                                        <Grid
                                            item
                                            key = {item.url}
                                            lg = {4}
                                            sm = {6}
                                            xs = {12}
                                        >
                                            <ResultCard
                                                item = {item}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </PageContainer>
            <Drawer
                anchor = 'bottom'
                onClose = {handleDrawerClose}
                open = {drawerOpen}
            >
                <Box
                    sx = {{
                        padding: 2,
                    }}
                >
                    <FilterPanel
                        {...filterProps}
                    />
                </Box>
            </Drawer>
        </AppShell>
    );
};

export default SearchResults;
