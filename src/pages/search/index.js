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
import allSources from '../../sources';
import SearchIcon from '@mui/icons-material/Search';

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
            }))
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

    return (
        <div
           
            style = {{
                   flex: '1 0 auto',
                   paddingBottom: '32px',
                  backgroundColor: 'white',
                  width:'100%'
            }}
        >
        
            <Helmet>
                <title>
                    {searchPhrase}
                </title>
            </Helmet>
            <Box
                m = {2}
                sx = {{
                    backgroundImage: 
                    "url('https://i.imgur.com/Su8gIK4.jpeg')",
                    backgroundRepeat:"no-repeat",
                    backgroundSize: 'cover',
                    width: '100vw',
                    height:'9%',
                   
                    
                }}
            >
                <Grid
                    alignItems = 'center'
                    container
                    
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
                                
                                id = 'outlined-basic'
                                inputProps = {{
                                    type: 'search',
                                }}
                                inputRef = {searchRef}
                                placeholder = {'LAMINO'}
                                margin = 'normal'
                                onChange = {handleFilterChange}
                                sx = {{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 3,
                                    width: 1200,
                                    marginLeft: 8,
                                    marginTop: 10,
                                }}
                                value = {searchPhrase}
                                variant = 'outlined'
                                
                            />
                            <Box
                           variant=""
                           sx = {{
                            position:'absolute',
                            top: 170,
                            right:80,
                            backgroundColor :'#F4C50A',
                            borderRadius : 1,
                            width : 120,
                            height: 36,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                    
                    }}
                    >
                       <span style={{margintop: 19, size: 3, paddingLeft: 25}}><SearchIcon/></span>
                       <h3 style={{marginLeft: 5,paddingLeft: 4}}>SOK</h3>
                        
                    </Box>
                        </form>
                    
                    </Grid>
                    <SourcesGroup
                        onChange = {handleGroupChange}
                    />
                    <Grid
                        md = {6}
                        xs = {12}
                        sx = {{
                            marginTop: 20,
                            paddingLeft: 10,
                        }}
                    >
                        <Typography
                            align = {'left'}
                            color = 'light'
                            // marginBottom = {4}
                            variant = {'h6'}
                            sx = {{
                                fontWeight: 700,
                            }}
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
                            container
                            justifyContent = 'flex-end'
                            md = {'6'}
                            mdOffset = 'auto'
                            xs = {'6'}
                            sx={{
                                marginTop: 20,
                                paddingRight: 10,
                                
                            }}
                        >
                            {!isAuthenticated && !isLoading && (
                                <Button
                                    onClick = {() => {
                                        return loginWithRedirect();
                                    }}
                                    variant = 'outline'
                                    sx = {{
                                        backgroundColor: 'wh#F5F5F5',
                                        color: '#000000',
                                        border: 1,
                                        borderColor: '#26828B',
                                    }}
                                >
                                    { 'Logga in för att skapa bevakning' }
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
                                    { 'Spara sökningen' }
                                </Button>
                            )}
                        </Grid>
                    )}
                </Grid>
                <Grid
                    columns = {{
                        sm: 5,
                        xl: 6,
                        xs: 2,
                    }}
                    container
                    justifyContent ='center'
                    spacing = {2}
                    sx = {{
                        marginTop: 4,
                        marginBottom: '10px',
                        paddingLeft: 10,
                        paddingRight: 10,
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