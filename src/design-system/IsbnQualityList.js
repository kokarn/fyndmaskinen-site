import PropTypes from 'prop-types';
import {
    Box,
    Link,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
    conditionColors,
} from './theme';

const formatPrice = (price) => {
    return new Intl.NumberFormat('sv-SE', {
        currency: 'SEK',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(price);
};

const formatCount = (count) => {
    return count === 1
        ? '1 annons'
        : `${count} annonser`;
};

// Condensed breakdown of the lowest price per quality tier for a scanned ISBN.
// Tiers arrive pre-sorted best -> worst from the backend; the "not specified"
// tier is rendered recessively so it never competes with real conditions.
const IsbnQualityList = ({
    conditions,
    listingCount,
    tierUrl,
}) => {
    if (!conditions.length) {
        return null;
    }

    return (
        <Stack
            spacing = {1}
        >
            <Typography
                color = 'text.secondary'
                fontSize = '0.72rem'
                fontWeight = {850}
                letterSpacing = '0.05em'
                sx = {{
                    textTransform: 'uppercase',
                }}
            >
                {`Lägsta pris per skick · ${formatCount(listingCount)}`}
            </Typography>
            <Paper
                elevation = {0}
                sx = {{
                    border: '1px solid',
                    borderColor: 'border.subtle',
                    overflow: 'hidden',
                }}
            >
                {conditions.map((tier, index) => {
                    const isUnknown = tier.id === 'ej-angivet';
                    const rowContent = (
                        <Stack
                            alignItems = 'center'
                            direction = 'row'
                            spacing = {1.5}
                            sx = {{
                                borderColor: 'border.subtle',
                                borderTop: index === 0
                                    ? 'none'
                                    : '1px solid',
                                paddingX: 2,
                                paddingY: 1.5,
                            }}
                        >
                            <Box
                                sx = {{
                                    backgroundColor: conditionColors[ tier.id ] || conditionColors[ 'ej-angivet' ],
                                    borderRadius: '50%',
                                    flexShrink: 0,
                                    height: 10,
                                    width: 10,
                                }}
                            />
                            <Box
                                sx = {{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    color = {isUnknown
                                        ? 'text.secondary'
                                        : 'text.primary'}
                                    fontWeight = {750}
                                    sx = {{
                                        fontSize: '0.92rem',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {tier.label}
                                </Typography>
                                <Typography
                                    color = 'text.secondary'
                                    variant = 'caption'
                                >
                                    {formatCount(tier.count)}
                                </Typography>
                            </Box>
                            <Typography
                                color = {isUnknown
                                    ? 'text.secondary'
                                    : 'text.primary'}
                                fontWeight = {850}
                                sx = {{
                                    fontSize: '1.05rem',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {formatPrice(tier.lowestPrice)}
                            </Typography>
                            {tierUrl && (
                                <ChevronRightIcon
                                    fontSize = 'small'
                                    sx = {{
                                        color: 'text.secondary',
                                    }}
                                />
                            )}
                        </Stack>
                    );

                    if (!tierUrl) {
                        return (
                            <Box
                                key = {tier.id}
                            >
                                {rowContent}
                            </Box>
                        );
                    }

                    return (
                        <Link
                            color = 'inherit'
                            href = {tierUrl(tier)}
                            key = {tier.id}
                            rel = 'noopener noreferrer'
                            sx = {{
                                display: 'block',
                                textDecoration: 'none',
                            }}
                            target = '_blank'
                            underline = 'none'
                        >
                            {rowContent}
                        </Link>
                    );
                })}
            </Paper>
        </Stack>
    );
};

IsbnQualityList.defaultProps = {
    listingCount: 0,
    tierUrl: null,
};

IsbnQualityList.propTypes = {
    conditions: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        lowestPrice: PropTypes.number.isRequired,
    })).isRequired,
    listingCount: PropTypes.number,
    tierUrl: PropTypes.func,
};

export default IsbnQualityList;
