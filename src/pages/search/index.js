import {
    useState,
    useRef,
    useEffect,
} from 'react';
import {
    Box,
    // Grid,
    Typography,
    TextField,
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
    ] = useStateWithLocalStorage('sources', {
        auction2000: true,
        auctionet: true,
        blocket: true,
        bukowskis: true,
        tradera: true,
    });

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

    return (
        <div
            className = 'App'
            style = {{
                flex: '1 0 auto',
                paddingBottom: '32px',
            }}
        >
            <Helmet>
                <title>
                    {searchPhrase}
                </title>
            </Helmet>
            <Box
                m = {2}
            >
                <Grid
                    container
                    spacing = {4}
                >
                    <Grid
                        md = {12}
                        xs = {12}
                    >
                        <form
                            autoComplete = 'off'
                            noValidate
                            onSubmit = {(event) => {
                                event.preventDefault();
                                searchRef.current.blur();
                            }}
                        >
                            <TextField
                                fullWidth
                                id = 'standard-name'
                                inputProps = {{
                                    type: 'search',
                                }}
                                inputRef = {searchRef}
                                label = {'Sök'}
                                margin = 'normal'
                                onChange = {handleFilterChange}
                                sx = {{
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: '#fff',
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: '#fff',
                                    },
                                }}
                                value = {searchPhrase}
                                variant = 'standard'
                            />
                        </form>
                    </Grid>
                    <SourcesGroup
                        onChange = {handleGroupChange}
                    />
                    <Grid
                        md = {6}
                        xs = {12}
                    >
                        <Typography
                            align = {'left'}
                            color = 'light'
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
                                    { `Hittade ${ searchResult?.length === MAX_ITEMS ?
                                        'mer än '
                                        :
                                        '' } ${ searchResult?.length } objekt för sökningen ${ searchPhrase }` }
                                </span>
                            )}
                        </Typography>
                    </Grid>
                    {searchPhrase.length > 0 && !isFetching && !searchPending && (
                        <Grid
                            // container
                            // justifyContent = 'flex-end'
                            md = {'6'}
                            mdOffset = 'auto'
                            xs = {'6'}
                        >
                            {!isAuthenticated && !isLoading && (
                                <Button
                                    onClick = {() => {
                                        return loginWithRedirect();
                                    }}
                                    variant = 'outlined'
                                >
                                    { 'Logga in för att skapa bevakning' }
                                </Button>
                            )}
                            {isAuthenticated && !isLoading && (
                                <Button
                                    // onClick = {() => {
                                    //     return loginWithRedirect();
                                    // }}
                                    variant = 'outlined'
                                >
                                    { 'Spara sökningen' }
                                </Button>
                            )}
                        </Grid>
                    )}
                </Grid>
                <Grid
                    columns = {{
                        sm: 4,
                        xl: 6,
                        xs: 2,
                    }}
                    container
                    spacing = {2}
                    sx = {{
                        marginBottom: '10px',
                    }}
                >
                    <SearchTable
                        displayItems = {searchResult}
                    />
                </Grid>
            </Box>
        </div>
    );
};

export default Search;
