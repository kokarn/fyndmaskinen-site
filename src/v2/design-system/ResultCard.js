import PropTypes from 'prop-types';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Typography,
} from '@mui/material';

import sources from '../../sources';
import SourceMark from './SourceMark';
import {
    density,
    shadows,
} from './theme';

const {
    resultCard,
} = density;

const ResultCard = ({
    eyebrow,
    item,
    notification,
    onOpen,
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
    const handleClick = (event) => {
        if (onOpen) {
            event.preventDefault();
            onOpen(notification);
        }
    };

    return (
        <Card
            sx = {{
                border: '2px solid',
                borderColor: notification && !notification.read
                    ? 'primary.main'
                    : 'border.subtle',
                boxShadow: notification && !notification.read
                    ? shadows.card
                    : 0,
                height: '100%',
                position: 'relative',
            }}
        >
            <CardActionArea
                href = {item.url}
                // eslint-disable-next-line react/jsx-no-bind
                onClick = {handleClick}
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
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: resultCard.contentPadding,
                        width: '100%',
                    }}
                >
                    <Stack
                        alignItems = 'center'
                        direction = 'row'
                        justifyContent = 'space-between'
                        marginBottom = {eyebrow || notification
                            ? 1
                            : 0}
                        spacing = {1}
                    >
                        {eyebrow && (
                            <Chip
                                color = 'secondary'
                                label = {eyebrow}
                                size = 'small'
                                sx = {{
                                    maxWidth: '100%',
                                }}
                            />
                        )}
                        {notification && !notification.read && (
                            <Chip
                                color = 'primary'
                                label = 'Ny'
                                size = 'small'
                            />
                        )}
                    </Stack>
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
    eyebrow: PropTypes.string,
    item: PropTypes.shape({
        currentPrice: PropTypes.number.isRequired,
        imageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
    notification: PropTypes.shape({
        id: PropTypes.string.isRequired,
        itemUrl: PropTypes.string.isRequired,
        read: PropTypes.bool.isRequired,
    }),
    onOpen: PropTypes.func,
};

ResultCard.defaultProps = {
    eyebrow: '',
    notification: null,
    onOpen: null,
};

export default ResultCard;
