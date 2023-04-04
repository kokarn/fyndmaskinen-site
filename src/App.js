import {
    useState,
    useEffect,
} from 'react';
import {
    Routes,
    Route,
    Link,
} from 'react-router-dom';

import {
    AppBar,
    Toolbar,
    Typography,
    // Button,
    Box,
    // Menu,
    // MenuItem,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {
    ThemeProvider,
    createTheme,
} from '@mui/material/styles';

import LoginButton from './components/login-button';
import StickyFooter from './components/footer';

import Main from './pages/main';
import Search from './pages/search';
import Deals from './pages/deals';
import Profile from './pages/profile';

const theme = createTheme({
    overrides: {
        MuiButton: {
            root: {
                '&:hover': {
                    backgroundColor: '#f4c50a',
                },
            },
        },
    },
    shape: {
        borderRadius: 2,
    },
    typography: {
        fontFamily: [
            'Urbanist',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },

});

const maxWidth = 1200;
// import Live from './Live';
// import Book from './pages/book2.jsx';

// eslint-disable-next-line
const App = () => {
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
        <ThemeProvider
            theme = {theme}
        >
            <CssBaseline />
            <Box
                sx = {{
                    backgroundAttachment: 'fixed',
                    backgroundImage: "url('https://i.imgur.com/Su8gIK4.jpeg')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',

                }}
            >
                <AppBar
                    position = 'static'
                    sx = {{
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    <Toolbar>
                        <Typography
                            sx = {{
                                flexGrow: 1,
                                justifyContent: 'start',
                            }}
                            variant = {'h5'}
                        >
                            <Link
                                // eslint-disable-next-line react/forbid-component-props
                                style = {{
                                    color: '#000000',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                                to = '/'
                            >
                                {'Fyndmaskinen'}
                            </Link>
                        </Typography>
                        {/* <Button
                            component = { Link }
                            sx = { {
                                color: '#fff',
                                flexGrow: 1,
                                justifyContent: 'start',
                            } }
                            to = '/deals'
                        >
                            { 'Deals' }
                        </Button> */}
                        {/* <Button>
                            <Link to="/book2">
                                { 'Book' }
                            </Link>
                        </Button> */}
                        {/* <Button>
                            <Link to="/live">
                                { 'Live' }
                            </Link>
                        </Button> */}
                        <LoginButton />
                    </Toolbar>
                </AppBar>
                <Box
                    mx = {2}
                    // my = {10}
                    sx = {wrapperProps}
                >
                    <Routes>
                        <Route
                            element = {<Main />}
                            path = '/'
                        />
                        <Route
                            element = {<Deals />}
                            path = '/deals'
                        />
                        <Route
                            element = {<Search />}
                            path = '/search/:searchString'
                        />
                        <Route
                            element = {<Search />}
                            path = '/search/'
                        />
                        <Route
                            element = {<Profile />}
                            path = '/profile'
                        />
                        {/* <Route
                            path="/book2"
                        >
                            <Book />
                        </Route>
                        <Route
                            path="/live"
                            component={Live}
                        />
                        */}
                    </Routes>
                </Box>
                <StickyFooter />
            </Box>
        </ThemeProvider>
    );
};

export default App;
