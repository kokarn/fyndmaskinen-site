import {
    useMemo,
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
import {
    ThemeProvider,
    createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import LoginButton from './components/login-button';
import StickyFooter from './components/footer';

import Main from './pages/main';
import Search from './pages/search';
import Deals from './pages/deals';
import Profile from './pages/profile';
// import Live from './Live';
// import Book from './pages/book2.jsx';

import './App.css';

// eslint-disable-next-line
const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () => {
            return createTheme({
                components: {
                    MuiFormLabel: {
                        styleOverrides: {
                            root: {
                                color: '#fff',
                            },
                        },
                    },
                },
                palette: {
                    light: '#fff',
                    mode: 'light',
                    text: {
                        primary: '#fff',
                    },
                    // mode: prefersDarkMode ?
                    //     'dark' :
                    //     'light',
                    // secondary: {
                    //     main: '#fff',
                    // },
                },
            });
        },
        [prefersDarkMode],
    );

    return (
        <ThemeProvider
            theme = {theme}
        >
            <CssBaseline />
            <Box
                sx = {{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <AppBar
                    position = 'static'
                >
                    <Toolbar>
                        <Typography
                            // color = {'inherit'}
                            sx = {{
                                flexGrow: 1,
                                justifyContent: 'start',
                            }}
                            variant = {'h5'}
                        >
                            <Link
                                to = '/'
                            >
                                { 'Fyndmaskinen' }
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
                        {/* <Button
                            color = { 'inherit' }
                        >
                            <Link to="/book2">
                                { 'Book' }
                            </Link>
                        </Button> */}
                        {/* <Button
                            color = { 'inherit' }
                        >
                            <Link to="/live">
                                { 'Live' }
                            </Link>
                        </Button> */}
                        <LoginButton />
                    </Toolbar>
                </AppBar>
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
                <StickyFooter />
            </Box>
        </ThemeProvider>
    );
};

export default App;
