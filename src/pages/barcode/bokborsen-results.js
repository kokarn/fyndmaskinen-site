import PropTypes from 'prop-types';
import {
    Alert,
    Box,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';

import IsbnQualityList from '../../v2/design-system/IsbnQualityList';

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
        const hasConditions = book.conditions?.length > 0;
        const hasPriceRange = book.price && book.priceHigh && book.price !== book.priceHigh;

        return (
            <Stack
                key = {book.id}
                spacing = {1.5}
                sx = {{
                    marginTop: 2,
                }}
            >
                <Box
                    sx = {{
                        alignItems: 'center',
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'border.subtle',
                        borderRadius: 2,
                        display: 'flex',
                        gap: 1.5,
                        padding: 1.5,
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
                                maxHeight: 72,
                                objectFit: 'contain',
                                width: 52,
                            }}
                        />
                    )}
                    <Box
                        sx = {{
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            sx = {{
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
                            variant = 'subtitle1'
                        >
                            {book.title}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                            variant = 'body2'
                        >
                            {[
                                book.author,
                                book.isbn || detectedCode,
                            ].filter(Boolean).join(' · ')}
                        </Typography>
                    </Box>
                </Box>

                {hasConditions
                    ? (
                        <IsbnQualityList
                            conditions = {book.conditions}
                            listingCount = {book.listingCount}
                        />
                    )
                    : book.price && (
                        <Typography
                            sx = {{
                                fontWeight: 700,
                            }}
                            variant = 'h5'
                        >
                            {hasPriceRange
                                ? `${formatPrice(book.price)} – ${formatPrice(book.priceHigh)}`
                                : formatPrice(book.price)}
                        </Typography>
                    )}
            </Stack>
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
        conditions: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number,
            id: PropTypes.string,
            label: PropTypes.string,
            lowestPrice: PropTypes.number,
        })),
        id: PropTypes.string,
        imageUrl: PropTypes.string,
        isbn: PropTypes.string,
        listingCount: PropTypes.number,
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
