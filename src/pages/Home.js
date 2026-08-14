import {
    useCallback,
    useMemo,
} from 'react';
import {
    useNavigate,
} from 'react-router-dom';
import ChairIcon from '@mui/icons-material/Chair';
import DiamondIcon from '@mui/icons-material/Diamond';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PaletteIcon from '@mui/icons-material/Palette';
import SpeakerIcon from '@mui/icons-material/Speaker';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
    useQuery,
} from 'react-query';
import {
    Helmet,
} from 'react-helmet';

import sources from '../sources';
import AppShell from '../design-system/AppShell';
import FilterDrawer from '../design-system/FilterDrawer';
import LandingCategories from '../design-system/LandingCategories';
import LandingCoverage from '../design-system/LandingCoverage';
import LandingFinds from '../design-system/LandingFinds';
import LandingHero from '../design-system/LandingHero';
import PageContainer from '../design-system/PageContainer';
import useStateWithLocalStorage from '../hooks/useStateWithLocalStorage';
import {
    getRandomItems,
} from '../features/search';
import {
    createV2SearchPath,
    getDefaultSourceState,
    getEnabledSourceIds,
} from '../search-state';

const RANDOM_ITEMS_STALE_MS = 300_000; // eslint-disable-line no-magic-numbers
const CATEGORIES = [
    {
        icon: <ChairIcon />,
        id: 'mobler',
        label: 'Möbler',
        term: 'möbler',
    },
    {
        icon: <PaletteIcon />,
        id: 'konst',
        label: 'Konst',
        term: 'konst',
    },
    {
        icon: <StorefrontIcon />,
        id: 'vintage',
        label: 'Vintage',
        term: 'vintage',
    },
    {
        icon: <SpeakerIcon />,
        id: 'ljud-bild',
        label: 'Ljud & bild',
        term: 'stereo',
    },
    {
        icon: <MenuBookIcon />,
        id: 'bocker',
        label: 'Böcker',
        term: 'böcker',
    },
    {
        icon: <DiamondIcon />,
        id: 'ur-smycken',
        label: 'Ur & smycken',
        term: 'armbandsur',
    },
];

const Home = () => {
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
    const handleSearch = useCallback((searchPhrase) => {
        navigate(createV2SearchPath(searchPhrase));
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
    }, [ setMaxPrice ]);
    const handleSortChange = useCallback((event) => {
        setSort(event.target.value);
    }, [ setSort ]);
    const handleReset = useCallback(() => {
        setSourceState(getDefaultSourceState(sources));
        setMaxPrice('');
        setSort('relevance');
    }, [
        setMaxPrice,
        setSort,
        setSourceState,
    ]);
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
    const mobileFilterAction = (
        <FilterDrawer
            applyLabel = 'Spara filter'
            filterProps = {filterProps}
            fullWidth
            label = 'Filter'
        />
    );
    const desktopFilterAction = (
        <FilterDrawer
            applyLabel = 'Spara filter'
            buttonSx = {{
                borderRadius: 999,
                height: '100%',
                minHeight: 64,
                paddingX: 3.5,
                whiteSpace: 'nowrap',
            }}
            filterProps = {filterProps}
            label = 'Välj filter'
        />
    );
    const enabledSourceIds = useMemo(() => {
        return getEnabledSourceIds(sourceState, sources);
    }, [ sourceState ]);
    const {
        data: randomItems = [],
        isFetching: isFetchingRandomItems,
    } = useQuery([
        'v2-random',
        enabledSourceIds,
    ], getRandomItems, {
        refetchOnWindowFocus: false,
        staleTime: RANDOM_ITEMS_STALE_MS,
    });
    const {
        data: auctionHouseCount = 0,
    } = useQuery('getAuctionHouseCount', async () => {
        const response = await fetch(`${window.API_HOSTNAME}/graphql`, {
            body: JSON.stringify({
                query: '{ getAuctionHouseCount }',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        const payload = await response.json();

        return payload?.data?.getAuctionHouseCount || 0;
    }, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    return (
        <AppShell>
            <Helmet>
                <title>
                    {'Fyndmaskinen – sök hela andrahandsmarknaden'}
                </title>
            </Helmet>
            <LandingHero
                filterAction = {desktopFilterAction}
                footer = {(
                    <LandingCategories
                        categories = {CATEGORIES}
                        onSelect = {handleSearch}
                    />
                )}
                mobileAction = {mobileFilterAction}
                onSearch = {handleSearch}
            />
            <LandingFinds
                isLoading = {isFetchingRandomItems}
                items = {randomItems}
            />
            <PageContainer>
                <LandingCoverage
                    auctionHouseCount = {auctionHouseCount}
                    sources = {sources}
                />
            </PageContainer>
        </AppShell>
    );
};

export default Home;
