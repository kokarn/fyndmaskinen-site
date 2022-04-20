import {
    useState,
    useRef,
    useEffect,
} from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
// import shuffle from 'just-shuffle';
import {
    useParams,
    useNavigate,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';

import SearchTable from '../../components/search-table';
import doSearch from '../../features/search';
import useDebounce from '../../hooks/useDebounce';

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

    const {
        isFetching,
        data: searchResult,
    } = useQuery([
        'search',
        debouncedSearchPhrase,
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
                    spacing = {2}
                    // alignItems = { 'flex-end' }
                >
                    {/* <Grid
                        item
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
                        item
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
                                value = {searchPhrase}
                                variant = 'standard'
                            />
                        </form>
                    </Grid>
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <FormGroup
                            row
                        >
                            <FormControlLabel
                                control = {<Checkbox
                                    defaultChecked
                                />}
                                disabled
                                label = {'Mindre auktionshus'}
                            />
                            {/* <FormControlLabel
                                control = {<Checkbox />}
                                disabled
                                label = 'Blocket'
                            />
                            <FormControlLabel
                                control = {<Checkbox />}
                                disabled
                                label = 'Marketplace'
                            /> */}
                            <FormControlLabel
                                control = {<Checkbox
                                    defaultChecked
                                />}
                                disabled
                                label = 'Tradera'
                            />
                            {/* <FormControlLabel
                                control = {<Checkbox />}
                                disabled
                                label = 'Auctionnet'
                            /> */}
                        </FormGroup>
                    </Grid>
                    {(isFetching || searchPending) && searchPhrase.length > 0 && (
                        <Grid
                            item
                            md = {12}
                            xs = {12}
                        >
                            {`Söker efter ${searchPhrase}...`}
                        </Grid>
                    )}
                    {searchPhrase.length > 0 && !isFetching && !searchPending && (
                        <Grid
                            item
                            md = {12}
                        >
                            <Typography
                                align = {'left'}
                                variant = {'h6'}
                            >
                                { `Hittade ${ searchResult.length } objekt för sökningen ${ searchPhrase }` }
                            </Typography>
                        </Grid>
                    )}
                </Grid>
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
            </Box>
        </div>
    );
};

export default Search;
