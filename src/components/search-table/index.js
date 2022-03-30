import {
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Grow,
} from '@mui/material';

const ITEM_TRANSITION_STAGGER = 25;
const MAX_ITEM_LIST = 40;

const SearchTable = ({
    displayItems,
}) => {
    // if (searchItems.length <= 0) {
    //     return null;
    // }

    const errorImage = 'https://fyndmaskinen.pages.dev/images/no-image.jpg';

    return displayItems.map((tile, index) => {
        let currentPrice = <span>{'Nuvarande bud: '}{ tile.currentPrice }</span>;

        if (tile.currentPrice === -1) {
            currentPrice = <span>{'Förhandsvisning'}</span>;
        }

        if (index > MAX_ITEM_LIST) {
            return false;
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
            </Grow>
        );
    });
};

export default SearchTable;
