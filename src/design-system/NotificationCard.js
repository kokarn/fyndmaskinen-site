import PropTypes from 'prop-types';
import {
    ButtonBase,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const formatCreatedAt = (createdAt) => {
    if (!createdAt) {
        return '';
    }

    return new Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(createdAt));
};

const formatPrice = (currentPrice) => {
    return currentPrice === -1
        ? 'Förhandsvisning'
        : new Intl.NumberFormat('sv-SE', {
            currency: 'SEK',
            maximumFractionDigits: 0,
            style: 'currency',
        }).format(currentPrice);
};

const NotificationCard = ({
    notification,
    onOpen,
}) => {
    const handleOpen = () => {
        onOpen(notification);
    };

    return (
        <Card
            sx = {{
                border: '1px solid',
                borderColor: notification.read
                    ? 'border.subtle'
                    : 'primary.main',
                boxShadow: notification.read
                    ? 'none'
                    : null,
                overflow: 'hidden',
            }}
        >
            <ButtonBase
                aria-label = {`Öppna ${notification.itemTitle}`}
                // eslint-disable-next-line react/jsx-no-bind
                onClick = {handleOpen}
                sx = {{
                    alignItems: 'stretch',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    width: '100%',
                }}
            >
                {notification.imageUrl && (
                    <CardMedia
                        alt = ''
                        component = 'img'
                        image = {notification.imageUrl}
                        sx = {{
                            objectFit: 'cover',
                            width: {
                                sm: 160,
                                xs: 104,
                            },
                        }}
                    />
                )}
                <CardContent
                    sx = {{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Stack
                        spacing = {1}
                    >
                        <Stack
                            alignItems = 'center'
                            direction = 'row'
                            justifyContent = 'space-between'
                            spacing = {1}
                        >
                            <Typography
                                color = 'text.secondary'
                                variant = 'caption'
                            >
                                {notification.watchMatch
                                    ? `Bevakning: ${notification.watchMatch}`
                                    : 'Ny träff'}
                            </Typography>
                            {!notification.read && (
                                <Chip
                                    color = 'primary'
                                    label = 'Ny'
                                    size = 'small'
                                />
                            )}
                        </Stack>
                        <Typography
                            component = 'h2'
                            fontWeight = {800}
                            variant = 'h6'
                        >
                            {notification.itemTitle}
                        </Typography>
                        <Typography
                            fontSize = '1rem'
                            fontWeight = {850}
                        >
                            {formatPrice(notification.currentPrice)}
                        </Typography>
                        {notification.itemDescription && (
                            <Typography
                                color = 'text.secondary'
                                sx = {{
                                    display: {
                                        sm: 'block',
                                        xs: 'none',
                                    },
                                }}
                            >
                                {notification.itemDescription}
                            </Typography>
                        )}
                        <Stack
                            alignItems = 'center'
                            direction = 'row'
                            justifyContent = 'space-between'
                            spacing = {1}
                        >
                            <Typography
                                color = 'text.secondary'
                                variant = 'caption'
                            >
                                {formatCreatedAt(notification.createdAt)}
                            </Typography>
                            <OpenInNewIcon
                                aria-hidden = 'true'
                                fontSize = 'small'
                            />
                        </Stack>
                    </Stack>
                </CardContent>
            </ButtonBase>
        </Card>
    );
};

NotificationCard.propTypes = {
    notification: PropTypes.shape({
        createdAt: PropTypes.string,
        currentPrice: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        itemDescription: PropTypes.string,
        itemTitle: PropTypes.string.isRequired,
        itemUrl: PropTypes.string.isRequired,
        read: PropTypes.bool.isRequired,
        watchMatch: PropTypes.string,
    }).isRequired,
    onOpen: PropTypes.func.isRequired,
};

export default NotificationCard;
