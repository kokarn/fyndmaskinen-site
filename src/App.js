import { useState, useMemo } from "react";
import {
    Routes,
    Route,
    Link
} from "react-router-dom";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem,
} from '@mui/material';

import Main from './pages/main';
import Deals from './pages/deals';
// import Live from './Live';
import Book from './pages/book2.jsx';

import './App.css';

const App = () => {
    const [totalItems, setTotalItems] = useState('?');

    const updateData = () => {
        fetch( `${ window.API_HOSTNAME }/deals` )
            .then( ( response ) => {
                return response.json();
            } )
            .then( ( response ) => {
                setTotalItems(response.totalItems);
            } )
            .catch( ( fetchError  ) => {
                console.error( fetchError );
            } );
    };

    useMemo(() => {
        updateData();
    }, []);

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position = "static"
                >
                    <Toolbar>
                        <Typography
                            color = { 'inherit' }
                            variant = { 'h5' }
                        >
                            <Link to="/">
                                { 'Fyndmaskinen' }
                            </Link>
                        </Typography>
                        <Button
                            sx = {{
                                flexGrow: 1,
                                justifyContent: 'start',
                                color: '#fff',
                            }}
                            component={Link}
                            to="/deals"
                        >
                            { 'Deals' }
                        </Button>
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
                            color = { 'inherit' }
                            align = { 'right' }
                        >
                            { `Sök bland ${ totalItems } objekt` }
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Routes>
                <Route
                    path="/"
                    element={<Main />}
                />
                <Route
                    path="/deals"
                    element={<Deals />}
                />
                {/* <Route
                    path="/book2"
                >
                    <Book />
                </Route> */}
            </Routes>
                    {/* <Route path="/live" component={Live} /> */}
        </div>
    );
}

export default App;
