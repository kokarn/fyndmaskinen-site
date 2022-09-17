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

import SearchTable from '../../components/search-table';
import SourcesGroup from '../../components/sources-group';
import doSearch from '../../features/search';
import useDebounce from '../../hooks/useDebounce';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';

const SEARCH_DELAY = 200;

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

    const searchRef = useRef(null);
    const debouncedSearchPhrase = useDebounce(searchPhrase, SEARCH_DELAY);
    const [
        sources,
        setSources,
    ] = useStateWithLocalStorage('sources', {
        auction2000: true,
        auctionet: true,
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
        >
            <Box
                m = {2}
            >
                <Grid
                    container
                    spacing = {4}
                    sx = {{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
                    // alignItems = { 'flex-end' }
                >
                    {/* <Grid
                        md = {12}
                        xs = {12}
                    >
                        <Typography
                            component = 'h1'
                            variant = 'h4'
                        >
                            {'Sök efter just dina fynd'}
                        </Typography>
                    </Grid> */}
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
                    {(isFetching || searchPending) && searchPhrase.length > 0 && (
                        <Grid
                            md = {12}
                            xs = {12}
                        >
                            <Typography
                                align = {'left'}
                                color = 'light'
                                variant = {'h6'}
                            >
                                {`Söker efter ${searchPhrase}...`}
                            </Typography>
                        </Grid>
                    )}
                    {searchPhrase.length > 0 && !isFetching && !searchPending && (
                        <Grid
                            md = {12}
                            xs = {12}
                        >
                            <Typography
                                align = {'left'}
                                color = 'light'
                                variant = {'h6'}
                            >
                                { `Hittade ${ searchResult.length } objekt för sökningen ${ searchPhrase }` }
                            </Typography>
                        </Grid>
                    )}
                    <Grid
                        columns = {{
                            md: 12,
                            xs: 4,
                        }}
                        container
                        spacing = {2}
                    >
                        <SearchTable
                            displayItems = {searchResult}
                        />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Search;
