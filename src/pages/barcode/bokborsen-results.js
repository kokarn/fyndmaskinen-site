import PropTypes from 'prop-types';
import {
    Alert,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';

const formatPrice = (price) => {
    return new Intl.NumberFormat('sv-SE', {
        currency: 'SEK',
        minimumFractionDigits: 0,
        style: 'currency',
    }).format(price);
};

const BokborsenResults = ({
    detectedCode,
    error,
    isError,
    isFetching,
    results,
}) => {
    if (isFetching) {
        return (
            <Box
                sx = {{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 1,
                    marginBottom: 2,
                }}
            >
                <CircularProgress
                    color = 'secondary'
                    size = {24}
                />
                <Typography
                    color = '#fff'
                    sx = {{
                        textShadow: '0 0 4px black',
                    }}
                    variant = 'body1'
                >
                    {'Söker i Bokbörsen...'}
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert
                severity = 'error'
            >
                {error.message}
            </Alert>
        );
    }

    if (detectedCode && results?.length === 0) {
        return (
            <Alert
                severity = 'info'
            >
                {'Inga böcker hittades för det skannade ISBN-numret.'}
            </Alert>
        );
    }

    if (!results?.length) {
        return null;
    }

    return results.map((book) => {
        const hasPriceRange = book.price && book.priceHigh && book.price !== book.priceHigh;

        return (
            <Box
                key = {book.id}
                sx = {{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 2,
                    display: 'flex',
                    gap: 2,
                    marginTop: 2,
                    padding: 3,
                }}
            >
                {book.imageUrl && (
                    <Box
                        alt = {book.title}
                        component = 'img'
                        src = {book.imageUrl}
                        sx = {{
                            borderRadius: 1,
                            flexShrink: 0,
                            height: 'auto',
                            maxHeight: 140,
                            objectFit: 'contain',
                            width: 90,
                        }}
                    />
                )}
                <Box>
                    <Typography
                        sx = {{
                            fontWeight: 600,
                        }}
                        variant = 'h5'
                    >
                        {book.title}
                    </Typography>
                    {book.author && (
                        <Typography
                            color = 'text.secondary'
                            variant = 'body2'
                        >
                            {book.author}
                        </Typography>
                    )}
                    {book.price && (
                        <Typography
                            sx = {{
                                fontWeight: 700,
                                marginTop: 1,
                            }}
                            variant = 'h4'
                        >
                            {hasPriceRange
                                ? `${formatPrice(book.price)} – ${formatPrice(book.priceHigh)}`
                                : formatPrice(book.price)}
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    });
};

BokborsenResults.defaultProps = {
    error: null,
    results: [],
};

BokborsenResults.propTypes = {
    detectedCode: PropTypes.string.isRequired,
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
    isError: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string,
        id: PropTypes.string,
        imageUrl: PropTypes.string,
        price: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        priceHigh: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        title: PropTypes.string,
    })),
};

export default BokborsenResults;
