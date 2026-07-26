import {
    useCallback,
} from 'react';
import {
    useNavigate,
} from 'react-router-dom';
import {
    Box,
} from '@mui/material';
import {
    useQuery,
} from 'react-query';
import {
    Helmet,
} from 'react-helmet';

import sources from '../../sources';
import AppShell from '../design-system/AppShell';
import FilterDrawer from '../design-system/FilterDrawer';
import LandingCoverage from '../design-system/LandingCoverage';
import LandingHero from '../design-system/LandingHero';
import PageContainer from '../design-system/PageContainer';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';
import {
    createV2SearchPath,
    getDefaultSourceState,
} from '../search-state';

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
                onSearch = {handleSearch}
            />
            <PageContainer>
                <Box
                    sx = {{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingY: {
                            sm: 3,
                            xs: 2.5,
                        },
                    }}
                >
                    <FilterDrawer
                        filterProps = {filterProps}
                        label = 'Välj filter'
                    />
                </Box>
                <LandingCoverage
                    auctionHouseCount = {auctionHouseCount}
                    sources = {sources}
                />
            </PageContainer>
        </AppShell>
    );
};

export default Home;
