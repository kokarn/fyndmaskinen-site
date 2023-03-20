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

import LoginButton from './components/login-button';
import StickyFooter from './components/footer';

import Main from './pages/main';
import Search from './pages/search';
import Deals from './pages/deals';
import Profile from './pages/profile';
// import Live from './Live';
// import Book from './pages/book2.jsx';

// eslint-disable-next-line
const App = () => {
    return (
        <>
            <CssBaseline />
            <Box
                sx = {{
                    backgroundImage: "url('https://i.imgur.com/Su8gIK4.jpeg')",
                    backgroundRepeat: 'non-replaceat',
                    backgroundSize: 'contain',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',

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
                                    paddingLeft: 25,
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
        </>
    );
};

export default App;
