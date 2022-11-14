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

import SourcesGroup from '../../components/sources-group';

const maxWidth = 768;
const numberOfPopularSearches = 3;

const popularSearches = [
    'lamino',
    'poul henningsen',
    'string',
    'bordslampa',
    'fotogenlampa',
    'höganäs',
    'ittala',
    'iphone',
];

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
            <form
                autoComplete = 'off'
                noValidate
                onSubmit = {(event) => {
                    event.preventDefault();
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
                            id = 'standard-name'
                            inputProps = {{
                                tabIndex: 0,
                                type: 'search',
                            }}
                            inputRef = {searchRef}
                            label = {'Sök'}
                            margin = 'normal'
                            // tabIndex = {0}
                            sx = {{
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: '#fff',
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#fff',
                                },
                            }}
                            variant = 'standard'
                        />
                    </Grid>
                    <SourcesGroup />
                    <Grid
                        md = {12}
                        xs = {12}
                    >
                        <Typography
                            color = 'light'
                            variant = 'inherit'
                            variantMapping = {{
                                inherit: 'span',
                            }}
                        >
                            {'Populära sökningar: '}
                        </Typography>
                        {getRandomItemsFromArray(popularSearches, numberOfPopularSearches).map((search) => {
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
                        })}
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Main;
