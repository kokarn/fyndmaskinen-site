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
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: `${maxWidth}px`,
    });

    useEffect(() => {
        if (mQuery.matches) {
            setWrapperProps({
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: `${maxWidth}px`,
            });
        } else {
            setWrapperProps({
                maxWidth: `${maxWidth}px`,
            });
        }
    }, [mQuery.matches]);

    useEffect(() => {
        let mediaQuery = window.matchMedia('(min-width: 768px)');

        mediaQuery.addEventListener('change', setMQuery);

        return () => mediaQuery.removeEventListener('change', setMQuery);
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
                    sx = {{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
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
                        <Button
                            variant = 'text'
                        >
                            <Link
                                to = '/search/string'
                            >
                                {'string'}
                            </Link>
                        </Button>
                        <Button
                            variant = 'text'
                        >
                            <Link
                                to = '/search/lego'
                            >
                                {'lego'}
                            </Link>
                        </Button>
                        <Button
                            variant = 'text'
                        >
                            <Link
                                to = '/search/guld'
                            >
                                {'guld'}
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Main;
