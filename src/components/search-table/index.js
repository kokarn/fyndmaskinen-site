import {
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Grow,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

const ITEM_TRANSITION_STAGGER = 25;
const MAX_ITEM_LIST = 40;

const SearchTable = ({
    displayItems,
}) => {
    // if (searchItems.length <= 0) {
    //     return null;
    // }

    const errorImage = 'https://fyndmaskinen.se/images/no-image.jpg';

    return displayItems.map((tile, index) => {
        let currentPrice = `${tile.currentPrice}:-`;

        if (tile.currentPrice === -1) {
            currentPrice = 'Förhandsvisning';
        }

        if (index > MAX_ITEM_LIST) {
            return false;
        }

        let tileIcon = (
            <GavelIcon
                fontSize = 'small'
            />
        );

        if (tile.type === 'tradera') {
            tileIcon = (
                <div
                    alt = 'Tradera'
                    // src = {`${process.env.PUBLIC_URL}/images/icons/tradera-100x100.png`}
                    style = {{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/images/icons/tradera-40x40.png)`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        height: '20px',
                        // maxWidth: '7px',
                        // transform: 'scale(4)',
                        width: '20px',
                    }}
                />
            );
        }

        return (
            <Grow
                in
                key = {`${tile.url}`}
                // eslint-disable-next-line
                style = {{
                    transformOrigin: 'top center',
                    transitionDelay: `${index * ITEM_TRANSITION_STAGGER}ms`,
                }}
            >
                <Grid
                    item
                    md = {2}
                    xs = {2}
                >
                    <Card
                        key = {tile.imageUrl}
                    >
                        <CardActionArea
                            href = {tile.url}
                        >
                            <CardMedia
                                alt = {tile.title}
                                component = 'img'
                                height = {200}
                                image = {`https://images.weserv.nl/?url=${ tile.imageUrl }&w=200&h=200&fit=contain&trim=10&errorredirect=${ errorImage }`}
                            />
                            <CardContent>
                                <Typography
                                    // component = 'div'
                                    gutterBottom
                                    sx = {{
                                        lineHeight: 'initial',
                                        maxHeight: '32px',
                                        overflow: 'hidden',
                                    }}
                                    variant = 'subtitle2'
                                >
                                    { tile.title }
                                </Typography>
                                <Typography
                                    color = 'text.secondary'
                                    sx = {{
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                    variant = 'body2'
                                >
                                    { currentPrice }
                                    {tileIcon}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grow>
        );
    });
};

export default SearchTable;
