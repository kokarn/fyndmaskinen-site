import {
    useState,
    useCallback,
} from 'react';

import {
    Box,
    Grid,
    Typography,
    Card,
    // CardHeader,
    CardMedia,
    CardContent,
    TextField,
    // IconButton,
    CardActionArea,
} from '@mui/material';
// import InfoIcon from '@material-ui/icons/Info';
// import CircularProgress from '@mui/material/CircularProgress';
// import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

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

    // errorImage = `https://images.weserv.nl/?url=i.imgur.com/PPVXbBi.jpg&w=200&h=200&t=letterbox&bg=black`;
    // errorImage = `https://i.imgur.com/fFRz0s0.jpg`;

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

            // src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=crop&a=center` }
            // src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=letterbox&bg=white` }
            return (
                <Grid
                    item
                    key = { `${tile.title}` }
                    md = { 2 }
                    xs = { 2 }
                >
                    <Card
                        key = { tile.img }
                    >
                        <CardActionArea>
                            <CardMedia
                                alt = { tile.title }
                                component = 'img'
                                height = { 200 }
                                image = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&fit=cover&errorredirect=${ errorImage }` }
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

                                {/* <IconButton
                                        href = { tile.url }
                                    >
                                        <InfoIcon
                                            className = { 'icon' }
                                        />
                                    </IconButton> */}
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
                mx = { 2 }
            >
                <Grid
                    container
                    spacing = { 2 }
                    // alignItems = { 'flex-end' }
                >
                    <Grid
                        item
                        md = { 12 }
                        xs = { 12 }
                    >
                        <form
                            autoComplete = 'off'
                            noValidate
                        >
                            <TextField
                                fullWidth
                                id = 'standard-name'
                                label = { 'Sök' }
                                margin = 'normal'
                                onChange = { handleFilterChange }
                                value = { searchPhrase }
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
                        md = { 12 }
                    >
                        { validSearch && (
                            <Typography
                                align = { 'left' }
                                variant = { 'h6' }
                            >
                                { `Hittade ${ searchItems.length } objekt för sökningen ${ searchPhrase }` }
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Grid
                    columns = { {
                        md: 12,
                        xs: 4,
                    } }
                    container
                    spacing = { 2 }
                >
                    { getSearchTable() }
                </Grid>
            </Box>
        </div>
    );
};

export default Main;
