import PropTypes from 'prop-types';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Stack,
    Typography,
} from '@mui/material';

import sources from '../../sources';
import SourceMark from './SourceMark';
import {
    density,
} from './theme';

const {
    resultCard,
} = density;

const ResultCard = ({
    item,
}) => {
    const source = sources.find((candidate) => {
        return candidate.ids
            ? candidate.ids.includes(item.type)
            : candidate.id === item.type;
    });
    const price = item.currentPrice === -1
        ? 'Förhandsvisning'
        : new Intl.NumberFormat('sv-SE', {
            currency: 'SEK',
            maximumFractionDigits: 0,
            style: 'currency',
        }).format(item.currentPrice);

    return (
        <Card
            sx = {{
                height: '100%',
                position: 'relative',
            }}
        >
            <CardActionArea
                href = {item.url}
                sx = {{
                    display: 'flex',
                    flexDirection: {
                        sm: 'column',
                        xs: 'row',
                    },
                    height: '100%',
                }}
            >
                <CardMedia
                    alt = {item.title}
                    component = 'img'
                    image = {[
                        `https://wsrv.nl/?url=${item.imageUrl}`,
                        'w=500&h=360&fit=contain&trim=10',
                        'errorredirect=https://fyndmaskinen.se/images/no-image.jpg&output=webp',
                    ].join('&')}
                    sx = {{
                        backgroundColor: 'surface.image',
                        height: resultCard.imageHeight,
                        objectFit: 'contain',
                        width: {
                            sm: '100%',
                            xs: 128,
                        },
                    }}
                />
                <CardContent
                    sx = {{
                        '&:last-child': {
                            paddingBottom: resultCard.contentPadding,
                        },
                        padding: resultCard.contentPadding,
                        width: '100%',
                        }}
                >
                    <Typography
                        fontWeight = {750}
                        sx = {{
                            display: '-webkit-box',
                            fontSize: '0.9rem',
                            lineHeight: 1.35,
                            minHeight: resultCard.titleMinHeight,
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                        }}
                    >
                        {item.title}
                    </Typography>
                    <Stack
                        alignItems = 'center'
                        direction = 'row'
                        justifyContent = 'space-between'
                        marginTop = {1}
                    >
                        <Typography
                            fontSize = '1rem'
                            fontWeight = {850}
                        >
                            {price}
                        </Typography>
                        {source && (
                            <SourceMark
                                compact
                                label = {source.label}
                                sourceId = {source.id}
                            />
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

ResultCard.propTypes = {
    item: PropTypes.shape({
        currentPrice: PropTypes.number.isRequired,
        imageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
};

export default ResultCard;
