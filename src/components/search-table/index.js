import {
    useEffect,
    useState,
} from 'react';
import {
    // Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Grow,
} from '@mui/material';

import {
    useInView,
} from 'react-intersection-observer';
import Grid from '@mui/material/Unstable_Grid2';

import sources from '../../sources';

const ITEM_TRANSITION_STAGGER = 25;
const MAX_ITEM_LIST = 42;

const SearchTable = ({
    displayItems,
}) => {
    const [
        pageSize,
        setPageSize,
    ] = useState(MAX_ITEM_LIST);

    const errorImage = 'https://fyndmaskinen.se/images/no-image.jpg';

    const {
        ref,
        inView,
    } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && displayItems?.length > pageSize) {
            setPageSize(pageSize + MAX_ITEM_LIST);
        }
    }, [inView]);

    const cardMediaStyle = {
        '@media (min-width:600px)': {
            height: '227px', // Responsive height for medium and larger screens
        },
        height: '182px', // Set your desired height here
    };

    const tiles = displayItems?.map((tile, index) => {
        if (!tile) {
            return false;
        }

        let currentPrice = `${tile.currentPrice}`;

        if (tile.currentPrice === -1) {
            currentPrice = 'Förhandsvisning';
        }

        if (index >= pageSize) {
            return false;
        }

        return (
            <Grow
                in
                key = {`${tile.url}`}
                // eslint-disable-next-line
                style = {{
                    transformOrigin: 'top center',
                    transitionDelay: `${(index % MAX_ITEM_LIST) * ITEM_TRANSITION_STAGGER}ms`,
                }}
            >
                <Grid
                    lg = {1}
                    md = {1}
                    spacing = {2}
                    xs = {1}
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
                                image = {`https://wsrv.nl/?url=${ tile.imageUrl }&w=400&h=400&fit=contain&trim=10&errorredirect=${ errorImage }&output=webp`}
                                sx = {cardMediaStyle}
                            />
                            <CardContent>
                                <Typography
                                    // component = 'div'
                                    color = 'text.secondary'
                                    gutterBottom
                                    sx = {{
                                        height: '32px',
                                        lineHeight: 'initial',
                                        overflow: 'hidden',
                                    }}
                                    variant = 'subtitle2'
                                >
                                    { tile.title }
                                </Typography>
                                <Typography
                                    color = 'text.secondary'
                                    component = 'span'
                                    sx = {{
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                    variant = 'body2'
                                >
                                    { new Intl.NumberFormat('sv-SE', {
                                        currency: 'SEK',
                                        minimumFractionDigits: 0,
                                        style: 'currency',
                                    }).format(currentPrice) }
                                    {sources.find((source) => source.id === tile.type).icon}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grow>
        );
    });

    tiles?.push(<span
        key = 'ref-link'
        ref = {ref}
    />);

    return tiles;
};

export default SearchTable;
