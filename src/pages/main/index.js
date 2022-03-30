import {
    useState,
    useMemo,
} from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
} from '@mui/material';
import shuffle from 'just-shuffle';

import SearchTable from '../../components/search-table';

const MAX_ITEMS = 40;
const SEARCH_DELAY = 300;

const Main = () => {
    const [
        searchPhrase, setSearchPhrase,
    ] = useState('');
    const [
        searchItems, setSearchItems,
    ] = useState([]);
    const [
        searchTimeout, setSearchTimeout,
    ] = useState(false);
    const [
        searchTitle,
        setSearchTitle,
    ] = useState('');
    const [
        searchActive,
        setSearchActive,
    ] = useState(false);

    const search = () => {
        let query = `{
            findItems( match: "${ searchPhrase }" ) {
                title
                url
                currentPrice
                img
                startTime
            }
        }`;

        if (searchPhrase === '') {
            query = `{
                getRandomItems {
                    title
                    url
                    currentPrice
                    img
                    startTime
                }
            }`;
        }

        return fetch(
            `${ window.API_HOSTNAME }/graphql`,
            {
                body: JSON.stringify({
                    query: query,
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
                return response.data.findItems || response.data.getRandomItems;
            })
            .catch((fetchError) => {
                console.error(fetchError);
            });
    };

    useMemo(async () => {
        const responseItems = await search();
        const shuffledItems = shuffle(responseItems);

        setSearchItems(shuffledItems.slice(0, MAX_ITEMS));
        setSearchActive(false);
    }, []);

    const handleFilterChange = (event) => {
        setSearchPhrase(event.target.value);

        clearTimeout(searchTimeout);

        if (event.target.value.length <= 2) {
            setSearchItems([]);
            setSearchTitle('');
            setSearchActive(false);

            return true;
        }

        setSearchActive(true);

        setSearchTimeout(setTimeout(async () => {
            const resultItems = await search();

            setSearchTitle(`Hittade ${ resultItems.length } objekt för sökningen ${ event.target.value }`);
            setSearchItems(resultItems);
            setSearchActive(false);
        }, SEARCH_DELAY));

        return true;
    };

    return (
        <div
            className = 'App'
        >
            <Box
                m = {2}
            >
                <Grid
                    container
                    spacing = {2}
                    // alignItems = { 'flex-end' }
                >
                    {/* <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <Typography
                            component = 'h1'
                            variant = 'h4'
                        >
                            {'Sök efter just dina fynd'}
                        </Typography>
                    </Grid> */}
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <form
                            autoComplete = 'off'
                            noValidate
                        >
                            <TextField
                                fullWidth
                                id = 'standard-name'
                                inputProps = {{
                                    type: 'search',
                                }}
                                label = {'Sök'}
                                margin = 'normal'
                                onChange = {handleFilterChange}
                                value = {searchPhrase}
                                variant = 'standard'
                            />
                            {/* <FormGroup>
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Auctions"
                            />
                            <FormControlLabel
                                disabled
                                control={<Checkbox />}
                                label="Blocket"
                            />
                            <FormControlLabel
                                disabled
                                control={<Checkbox />}
                                label="Marketplace"
                            />
                        </FormGroup> */}
                        </form>
                        {searchActive && (
                            <div>
                                {'Söker...'}
                            </div>
                        )}
                    </Grid>
                    <Grid
                        item
                        md = {12}
                    >
                        <Typography
                            align = {'left'}
                            variant = {'h6'}
                        >
                            { searchTitle }
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    columns = {{
                        md: 12,
                        xs: 4,
                    }}
                    container
                    spacing = {2}
                >
                    <SearchTable
                        displayItems = {searchItems}
                    />
                </Grid>
            </Box>
        </div>
    );
};

export default Main;
