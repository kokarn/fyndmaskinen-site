import {useState} from 'react';

import {
    Box,
    Grid,
    Typography,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    TextField,
    IconButton,
    CardActionArea,
} from '@mui/material';
// import InfoIcon from '@material-ui/icons/Info';
// import CircularProgress from '@mui/material/CircularProgress';
// import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

function Main(props){
    const [searchPhrase, setSearchPhrase] = useState('');
    const [searchItems, setSearchItems] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [validSearch, setValidSearch] = useState(false);

    let searchTimeout = false;
    const errorImage = `https://fyndmaskinen.pages.dev/images/no-image.jpg`;

    // errorImage = `https://images.weserv.nl/?url=i.imgur.com/PPVXbBi.jpg&w=200&h=200&t=letterbox&bg=black`;
    // errorImage = `https://i.imgur.com/fFRz0s0.jpg`;

    const search = () => {
        fetch( `${ window.API_HOSTNAME }/graphql`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { query: `{
                  findItems( match: "${ searchPhrase }" ) {
                    title
                    url
                    currentPrice
                    img
                    startTime
                  }
                }` } ),
            }
        )
        .then( ( response ) => {
            return response.json();
        } )
        .then( ( response ) => {
            setSearchItems(response.data.findItems.slice( 0, 40 ));
            setShowLoading(false);
            setValidSearch(true);
        } )
        .catch( ( fetchError  ) => {
            console.error( fetchError );
        } )
    }

    const handleFilterChange = ( event ) => {
        setSearchPhrase(event.target.value);
        setShowLoading(true);

        clearTimeout( searchTimeout );

        if ( event.target.value.length <= 2 ) {
            setSearchItems([]);
            setShowLoading(false);
            setValidSearch(false);

            return true;
        }

        searchTimeout = setTimeout( () => {
            search();
        }, 300 );
    }

    const getSearchTable = () => {
        if ( searchItems.length <= 0 ) {
            return null;
        }

        return searchItems.map( ( tile ) => {
            let currentPrice = <span>Nuvarande bud: { tile.currentPrice }</span>;

            if ( tile.currentPrice === -1 ) {
                currentPrice = <span>Förhandsvisning</span>;
            }
            // src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=crop&a=center` }
            // src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=letterbox&bg=white` }
            return <Grid
                item
                md = {2}
            >
                <Card
                    key = { tile.img }
                >
                    <CardActionArea>
                        <CardMedia
                            alt = { tile.title }
                            height = {200}
                            component='img'
                            image = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=letterbox&bg=black&errorredirect=${ errorImage }` }
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h7" component="div">
                                { tile.title }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
        } )
    }

    return (
        <div className="App">
            <Box
                mx = {2}
            >
                <Grid
                    container
                    spacing = { 2 }
                    // alignItems = { 'flex-end' }
                >
                    <Grid
                        item
                        md = { 12 }
                    >
                        <form
                        noValidate
                        autoComplete="off"
                    >
                            <TextField
                                fullWidth
                                id = 'standard-name'
                                label = { 'Sök' }
                                value = { searchPhrase }
                                onChange = { handleFilterChange }
                                margin = 'normal'
                            />
                            { showLoading &&
                                <div>
                                    Söker...
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
                        { validSearch && <Typography
                            align = { 'left' }
                            variant = { 'h6' }
                        >
                            { `Hittade ${ searchItems.length } objekt för sökningen ${ searchPhrase }` }
                        </Typography> }
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing = {2}
                    columns = { {
                        md: 12,
                        xs: 4,
                    } }
                >
                    { getSearchTable() }
                </Grid>
            </Box>
        </div>
    );
}

export default Main;
