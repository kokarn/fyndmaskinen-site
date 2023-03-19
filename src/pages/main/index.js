import {
    useState,
    useRef,
    useEffect,
} from 'react';
import {
    Box,
    Button,
    // Grid,
    TextField,
    Typography,
} from '@mui/material';
import {
    Link,
    // useParams,
    useNavigate,
} from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Helmet,
} from 'react-helmet';

import SourcesGroup from '../../components/sources-group';
import SearchIcon from '@mui/icons-material/Search';

const maxWidth = 1200;
// const numberOfPopularSearches = 3;

// const popularSearches = [
//     'lamino',
//     'poul henningsen',
//     'string',
//     'bordslampa',
//     'fotogenlampa',
//     'höganäs',
//     'ittala',
//     'iphone',
// ];

const getRandomItemsFromArray = (array, count) => {
    const result = [];
    const arrayCopy = [...array];

    for (let i = 0; i < count; i = i + 1) {
        const randomIndex = Math.floor(Math.random() * arrayCopy.length);

        result.push(arrayCopy[ randomIndex ]);
        arrayCopy.splice(randomIndex, 1);
    }

    return result;
};

const Main = () => {
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const [
        mQuery,
        setMQuery,
    ] = useState({
        matches: window.innerWidth > maxWidth,
    });

    const [
        wrapperProps,
        setWrapperProps,
    ] = useState({
        flex: '1 0 auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: `${maxWidth}px`,
    });

    useEffect(() => {
        if (mQuery.matches) {
            setWrapperProps({
                flex: '1 0 auto',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: `${maxWidth}px`,
            });
        } else {
            setWrapperProps({
                flex: '1 0 auto',
                maxWidth: `${maxWidth}px`,
            });
        }
    }, [mQuery.matches]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');

        mediaQuery.addEventListener('change', setMQuery);

        return () => {
            return mediaQuery.removeEventListener('change', setMQuery);
        };
    }, []);

    return (
        <Box
            mx = {2}
            my = {10}
            sx = {wrapperProps}
        >
            <Helmet>
                <title>
                    {'Fyndmaskinen'}
                </title>
            </Helmet>
            <form
                autoComplete = 'off'
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
                    spacing = {4}
                >
                    <Grid
                        md = {12}
                        xs = {12}
                    >
                        <TextField
                            autoFocus
                            // color = 'light'
                            fullWidth
                            id = 'outlined-basic'
                            inputProps = {{
                                tabIndex: 0,
                                type: 'search',
                            }}
                            inputRef = {searchRef}
                            placeholder = {'LAMINO'}
                            margin = 'normal'
                            // tabIndex = {0}
                            sx = {{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 3,
                               
                            }}
                            variant = 'outlined'
                        />
                        <Box 
                           sx = {{
                            display: 'flex',
                            gap: 2,
                            color: '#FFFFFF'
                            }}
                        >
                          <Typography>
                            {' Populära sökningar: Bordslampa'}
                          </Typography>
                         <Typography>
                          {' Ittala '}
                         </Typography>
                         <Typography>
                           {'Iphone'}
                         </Typography>
                        </Box>
                       
                    </Grid>
                    <Grid
                    sx={{
                        display : 'flex',
                        marginLeft: 45,
                        
                    }}
                    >
                    <Button 
                    variant=""
                    sx = {{
                        backgroundColor :'#F4C50A',
                        borderRadius : 1,
                        width : 210,
                        height: 45,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                    
                    }}
                    >
                       <span style={{margintop: 4, size: 3}}><SearchIcon/></span>
                       <h2 style={{marginLeft: 5}}>SOK</h2>
                        
                    </Button>
                    </Grid>
                    <SourcesGroup />
                 
                    <Grid
                        md = {12}
                        xs = {12}
                    >
                        {/* <Typography
                            color = 'light'
                            variant = 'inherit'
                            variantMapping = {{
                                inherit: 'span',
                            }}
                        >
                            {'Populära sökningar: '}
                        </Typography> */}
                        {/* {getRandomItemsFromArray(popularSearches, numberOfPopularSearches).map((search) => {
                            return (
                                <Button
                                    key = {`popular-search-${search}`}
                                    size = 'small'
                                    variant = 'text'
                                >
                                    <Link
                                        to = {`/search/${search}`}
                                    >
                                        {search}
                                    </Link>
                                </Button>
                            );
                        })} */}
                    </Grid>
                </Grid>
            </form>
            {/* <Typography>
              paractice
            </Typography> */}
            {/* <Button 
            color = 'primary'
            >
              primary
            </Button>  */}
            {/* <Button
               color = 'secondary'
             > 
             secondary
             </Button>
            <Button 
              color = 'inherit'
            >
            inherit
            </Button> */}
        </Box>
    );
};

export default Main;
