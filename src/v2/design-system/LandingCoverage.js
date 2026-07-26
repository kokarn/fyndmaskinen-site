import PropTypes from 'prop-types';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';

import SourceMark from './SourceMark';

const LandingCoverage = ({
    auctionHouseCount,
    sources,
}) => {
    return (
        <Box
            component = 'section'
            sx = {{
                borderColor: 'border.subtle',
                borderTop: '1px solid',
                paddingBottom: {
                    sm: 7,
                    xs: 4,
                },
                paddingTop: {
                    sm: 6,
                    xs: 4,
                },
            }}
        >
            <Stack
                alignItems = 'center'
                spacing = {2}
                textAlign = 'center'
            >
                <Typography
                    color = 'text.secondary'
                    fontSize = '0.75rem'
                    fontWeight = {850}
                    letterSpacing = '0.07em'
                >
                    {'MARKNADSPLATSER'}
                </Typography>
                <Typography
                    maxWidth = {650}
                    variant = 'h2'
                >
                    {'En sökning. Hela andrahandsmarknaden.'}
                </Typography>
                <Typography
                    color = 'text.secondary'
                    maxWidth = {620}
                >
                    {auctionHouseCount
                        ? `Sök samtidigt hos ${auctionHouseCount} mindre auktionshus och Sveriges `
                            + 'största marknadsplatser.'
                        : 'Sök samtidigt hos mindre auktionshus och Sveriges största marknadsplatser.'}
                </Typography>
                <Stack
                    direction = 'row'
                    flexWrap = 'wrap'
                    gap = {1}
                    justifyContent = 'center'
                    maxWidth = {850}
                >
                    {sources.map((source) => {
                        const label = source.id === 'auction2000' && auctionHouseCount
                            ? `${auctionHouseCount} mindre auktionshus`
                            : source.label;

                        return (
                            <SourceMark
                                key = {source.id}
                                label = {label}
                                sourceId = {source.id}
                            />
                        );
                    })}
                </Stack>
                <Typography
                    color = 'text.secondary'
                    fontSize = '0.9rem'
                    maxWidth = {560}
                >
                    {'Resultaten samlas på ett ställe. När du hittar något öppnas '
                        + 'originalannonsen hos marknadsplatsen.'}
                </Typography>
            </Stack>
        </Box>
    );
};

LandingCoverage.defaultProps = {
    auctionHouseCount: 0,
};

LandingCoverage.propTypes = {
    auctionHouseCount: PropTypes.number,
    sources: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
};

export default LandingCoverage;
