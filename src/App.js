import {
    useState, useMemo,
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

import LoginButton from './components/login-button';

import Main from './pages/main';
import Search from './pages/search';
import Deals from './pages/deals';
import Profile from './pages/profile';
// import Live from './Live';
// import Book from './pages/book2.jsx';

import './App.css';

// eslint-disable-next-line
const App = () => {
    const [
        totalItems, setTotalItems,
    ] = useState('?');

    const updateData = () => {
        fetch(
            `${ window.API_HOSTNAME }/graphql`,
            {
                body: JSON.stringify({
                    query: `{
                        getItemCount
                    }`,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                setTotalItems(response.data.getItemCount);
            })
            .catch((fetchError) => {
                console.error(fetchError);
            });
    };

    useMemo(() => {
        updateData();
    }, []);

    return (
        <Box
            sx = {{
                flexGrow: 1,
                minHeight: '100vh',
            }}
        >
            <AppBar
                position = 'static'
            >
                <Toolbar>
                    <Typography
                        color = {'inherit'}
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
                    <Typography
                        align = {'right'}
                        color = {'inherit'}
                        sx = {{
                            marginRight: '10px',
                        }}
                    >
                        { `${ totalItems } objekt` }
                    </Typography>
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
        </Box>
    );
};

export default App;
