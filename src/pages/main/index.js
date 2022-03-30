import {
    useState,
    useCallback,
} from 'react';

import {
    Box,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    TextField,
    CardActionArea,
} from '@mui/material';

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
        showLoading, setShowLoading,
    ] = useState(false);
    // const [
    //     totalItems, setTotalItems,
    // ] = useState(0);
    const [
        validSearch, setValidSearch,
    ] = useState(false);
    const [
        searchTimeout, setSearchTimeout,
    ] = useState(false);

    const errorImage = 'https://fyndmaskinen.pages.dev/images/no-image.jpg';

    const search = () => {
        fetch(
            `${ window.API_HOSTNAME }/graphql`,
            {
                body: JSON.stringify({
                    query: `{
                        findItems( match: "${ searchPhrase }" ) {
                            title
                            url
                            currentPrice
                            img
                            startTime
                        }
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
                setSearchItems(response.data.findItems.slice(0, MAX_ITEMS));
                setShowLoading(false);
                setValidSearch(true);
            })
            .catch((fetchError) => {
                console.error(fetchError);
            });
    };

    const handleFilterChange = useCallback((event) => {
        setSearchPhrase(event.target.value);
        setShowLoading(true);

        clearTimeout(searchTimeout);

        if (event.target.value.length <= 2) {
            setSearchItems([]);
            setShowLoading(false);
            setValidSearch(false);

            return true;
        }

        setSearchTimeout(setTimeout(() => {
            search();
        }, SEARCH_DELAY));

        return true;
    });

    const getSearchTable = () => {
        if (searchItems.length <= 0) {
            return null;
        }

        return searchItems.map((tile) => {
            let currentPrice = <span>{'Nuvarande bud: '}{ tile.currentPrice }</span>;

            if (tile.currentPrice === -1) {
                currentPrice = <span>{'Förhandsvisning'}</span>;
            }

            return (
                <Grid
                    item
                    key = {`${tile.title}`}
                    md = {2}
                    xs = {2}
                >
                    <Card
                        key = {tile.img}
                    >
                        <CardActionArea
                            href = {tile.url}
                        >
                            <CardMedia
                                alt = {tile.title}
                                component = 'img'
                                height = {200}
                                image = {`https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&fit=cover&errorredirect=${ errorImage }`}
                            />
                            <CardContent>
                                <Typography
                                    component = 'div'
                                    gutterBottom
                                    variant = 'h7'
                                >
                                    { tile.title }
                                </Typography>
                                <Typography
                                    color = 'text.secondary'
                                    variant = 'body2'
                                >
                                    { currentPrice }
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            );
        });
    };

    return (
        <div
            className = 'App'
        >
            <Box
                mx = {2}
            >
                <Grid
                    container
                    spacing = {2}
                    // alignItems = { 'flex-end' }
                >
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
                            { showLoading &&
                                <div>
                                    {'Söker...'}
                                </div>
                            }
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
                    </Grid>
                    <Grid
                        item
                        md = {12}
                    >
                        { validSearch && (
                            <Typography
                                align = {'left'}
                                variant = {'h6'}
                            >
                                { `Hittade ${ searchItems.length } objekt för sökningen ${ searchPhrase }` }
                            </Typography>
                        )}
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
                    { getSearchTable() }
                </Grid>
            </Box>
        </div>
    );
};

export default Main;
