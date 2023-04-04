import {
    useState,
    useRef,
    useEffect,
} from 'react';
import {
    Typography,
    Button,
} from '@mui/material';
// import shuffle from 'just-shuffle';
import {
    useParams,
    useNavigate,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';
import Grid from '@mui/material/Unstable_Grid2';
import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Helmet,
} from 'react-helmet';

import SearchTable from '../../components/search-table';
import SourcesGroup from '../../components/sources-group';
import doSearch from '../../features/search';
import useDebounce from '../../hooks/useDebounce';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';
import allSources from '../../sources';
import SearchField from '../../components/search-field';

const SEARCH_DELAY = 200;
const MAX_ITEMS = 500;

const Search = () => {
    const {
        searchString,
    } = useParams();
    const [
        searchPhrase,
        setSearchPhrase,
    ] = useState(searchString || '');
    const navigate = useNavigate();
    const [
        searchPending,
        setSearchPending,
    ] = useState(false);
    const {
        loginWithRedirect,
        // user,
        isAuthenticated,
        isLoading,
    } = useAuth0();

    const searchRef = useRef(null);
    const debouncedSearchPhrase = useDebounce(searchPhrase, SEARCH_DELAY);
    const [
        sources,
        setSources,
    ] = useStateWithLocalStorage(
        'sources',
        Object.fromEntries(allSources
            .map((source) => {
                return [
                    source.id,
                    source.defaultEnabled,
                ];
            })),
    );

    const {
        isFetching,
        data: searchResult,
    } = useQuery([
        'search',
        debouncedSearchPhrase,
        Object.keys(sources).filter((sourceKey) => {
            return sources[ sourceKey ];
        }),
    ], doSearch, {
        placeholderData: [],
        refetchInterval: 600000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const handleFilterChange = (event) => {
        setSearchPhrase(event.target.value);
        setSearchPending(true);

        return true;
    };

    const handleGroupChange = (newSources) => {
        setSources(newSources);

        return true;
    };

    useEffect(() => {
        navigate(`/search/${debouncedSearchPhrase}`);
        setSearchPending(false);
    }, [debouncedSearchPhrase]);

    return [
        <Helmet
            key = {'helmet'}
        >
            <title>
                {searchPhrase}
            </title>
        </Helmet>,
        <form
            autoComplete = 'off'
            key = 'search-form'
            noValidate
            onSubmit = {(event) => {
                event.preventDefault();
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'view_search_results',
                    value: searchRef.current.value,
                });
                navigate(`/search/${searchRef.current.value}`);
            }}
        >
            <Grid
                alignItems = 'center'
                container
                key = {'search'}
            >
                <Grid
                    md = {12}
                    xs = {12}
                >
                    <SearchField
                        onChange = {handleFilterChange}
                        searchRef = {searchRef}
                        value = {searchPhrase}
                    />
                </Grid>
                <SourcesGroup
                    onChange = {handleGroupChange}
                />
                <Grid
                    md = {6}
                    sx = {{
                        marginTop: 4,
                    }}
                    xs = {12}
                >
                    <Typography
                        align = {'left'}
                        color = '#fff'
                        sx = {{
                            fontWeight: 700,
                            textShadow: '0 0 4px black',
                        }}
                        // marginBottom = {4}
                        variant = {'h6'}
                    >
                        {(isFetching || searchPending) && searchPhrase.length > 0 && (
                            <span>
                                {`Söker efter ${searchPhrase}...`}
                            </span>
                        )}
                        {searchPhrase.length > 0 && !isFetching && !searchPending && (
                            <span>
                                {`Hittade ${searchResult?.length === MAX_ITEMS ?
                                    'mer än '
                                    :
                                    ''} ${searchResult?.length} objekt för sökningen ${searchPhrase}`}
                            </span>
                        )}
                    </Typography>
                </Grid>
                {searchPhrase.length > 0 && !isFetching && !searchPending && (
                    <Grid
                        container
                        justifyContent = 'flex-end'
                        md = {'6'}
                        mdOffset = 'auto'
                        sx = {{
                            marginTop: 4,
                        }}
                        xs = {'6'}
                    >
                        {!isAuthenticated && !isLoading && (
                            <Button
                                onClick = {() => {
                                    return loginWithRedirect();
                                }}
                                sx = {{
                                    backgroundColor: 'wh#F5F5F5',
                                    border: 1,
                                    borderColor: '#26828B',
                                    color: '#000000',
                                }}
                                variant = 'outline'
                            >
                                {'Logga in för att skapa bevakning'}
                            </Button>
                        )}
                        {isAuthenticated && !isLoading && (
                            <Button
                                // onClick = {() => {
                                //     return loginWithRedirect();
                                // }}
                                href = '/profile'
                                variant = 'outlined'
                            >
                                {'Spara sökningen'}
                            </Button>
                        )}
                    </Grid>
                )}
            </Grid>
        </form>,
        <Grid
            columns = {{
                sm: 5,
                xl: 6,
                xs: 2,
            }}
            container
            justifyContent = 'center'
            key = {'search-result'}
            spacing = {2}
            sx = {{
                marginBottom: '10px',
                marginTop: 4,
            }}
        >
            <SearchTable
                displayItems = {searchResult}
            />
        </Grid>,
    ];
};

export default Search;
