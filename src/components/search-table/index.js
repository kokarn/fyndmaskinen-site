import {
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
} from '@mui/material';

const SearchTable = ({
    displayItems,
}) => {
    // if (searchItems.length <= 0) {
    //     return null;
    // }

    const errorImage = 'https://fyndmaskinen.pages.dev/images/no-image.jpg';

    return displayItems.map((tile) => {
        let currentPrice = <span>{'Nuvarande bud: '}{ tile.currentPrice }</span>;

        if (tile.currentPrice === -1) {
            currentPrice = <span>{'Förhandsvisning'}</span>;
        }

        return (
            <Grid
                item
                key = {`${tile.url}`}
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

export default SearchTable;
