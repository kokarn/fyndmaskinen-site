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
import ApiToggle from './components/api-toggle';

import Main from './pages/main';
import Search from './pages/search';
import Deals from './pages/deals';
import IsbnDeals from './pages/isbn-deals';
import Profile from './pages/profile';
import Admin from './pages/admin';
import AdminWatches from './pages/admin/watches';
import BarcodeQuagga from './pages/barcode/quagga';
import BarcodeZXing from './pages/barcode/zxing';
import BarcodeHtml5Qrcode from './pages/barcode/html5-qrcode';
import V2Provider from './v2/V2Provider';
import V2DesignSystem from './v2/pages/DesignSystem';
import V2Home from './v2/pages/Home';
import V2SearchResults from './v2/pages/SearchResults';

// eslint-disable-next-line no-process-env, no-undef
const PUBLIC_URL = process.env.PUBLIC_URL;

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#2d9ba6',
                    },
                    backgroundColor: '#26828B',
                    color: '#fff',
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#f8d54a',
                    },
                },
            },
        },
    },
    palette: {
        action: {
            hover: '#fff',
        },
        secondary: {
            contrastText: '#fff',
            main: '#f4c50a',
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

    if (window.location.pathname.startsWith('/v2')) {
        return (
            <V2Provider>
                <Routes>
                    <Route
                        element = {<V2Home />}
                        path = '/v2'
                    />
                    <Route
                        element = {<V2DesignSystem />}
                        path = '/v2/design-system'
                    />
                    <Route
                        element = {<V2SearchResults />}
                        path = '/v2/search/:searchString'
                    />
                </Routes>
            </V2Provider>
        );
    }

    return (
        <ThemeProvider
            theme = {theme}
        >
            <CssBaseline />
            <Box
                sx = {{
                    backgroundAttachment: 'fixed',
                    backgroundImage: `url(${PUBLIC_URL}/images/background-4.jpg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100svh',

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
                            element = {<IsbnDeals />}
                            path = '/deals/isbn'
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
                        <Route
                            element = {<Admin />}
                            path = '/admin'
                        />
                        <Route
                            element = {<AdminWatches />}
                            path = '/admin/watches'
                        />
                        <Route
                            element = {<BarcodeHtml5Qrcode />}
                            path = '/barcode'
                        />
                        <Route
                            element = {<BarcodeQuagga />}
                            path = '/barcode/quagga'
                        />
                        <Route
                            element = {<BarcodeZXing />}
                            path = '/barcode/zxing'
                        />
                        <Route
                            element = {<BarcodeHtml5Qrcode />}
                            path = '/barcode/html5-qrcode'
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
                <ApiToggle />
            </Box>
        </ThemeProvider>
    );
};

export default App;
