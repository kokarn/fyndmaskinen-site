import {
    useCallback,
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
    Chip,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

import {
    Helmet,
} from 'react-helmet';

import sources from '../../sources';
import doSearch from '../../features/search';
import useDebounce from '../../hooks/useDebounce';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';
import AppShell from '../design-system/AppShell';
import FilterPanel from '../design-system/FilterPanel';
import FilterDrawer from '../design-system/FilterDrawer';
import PageContainer from '../design-system/PageContainer';
import ResultCard from '../design-system/ResultCard';
import SearchBox from '../design-system/SearchBox';
import SearchLoading from '../design-system/SearchLoading';
import SaveSearchButton from '../design-system/SaveSearchButton';
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
    ] = useStateWithLocalStorage('v2-max-price', '');
    const [
        sort,
        setSort,
    ] = useStateWithLocalStorage('v2-sort', 'relevance');

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
        keepPreviousData: true,
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
                            {isFetching
                                ? 'Söker efter fynd…'
                                : `${searchResult.length} fynd för “${searchPhrase}”`}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                        >
                            {`Resultat från ${enabledSourceIds.length} marknadsplatser`}
                        </Typography>
                    </Box>
                    <Stack
                        direction = 'row'
                        spacing = {1}
                        sx = {{
                            width: {
                                sm: 'auto',
                                xs: '100%',
                            },
                        }}
                    >
                        <Box
                            sx = {{
                                flex: 1,
                            }}
                        >
                            <SaveSearchButton
                                fullWidth
                                searchPhrase = {searchPhrase}
                            />
                        </Box>
                        <FilterDrawer
                            buttonSx = {{
                                display: {
                                    md: 'none',
                                },
                                flex: 1,
                            }}
                            filterProps = {filterProps}
                            fullWidth
                        />
                    </Stack>
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
                            <SearchLoading />
                        )}
                        {!isFetching && (
                            <Grid
                                container
                                spacing = {{
                                    sm: 1.5,
                                    xs: 1,
                                }}
                            >
                                {searchResult.map((item) => {
                                    return (
                                        <Grid
                                            item
                                            key = {item.url}
                                            lg = {3}
                                            sm = {4}
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

        </AppShell>
    );
};

export default SearchResults;
