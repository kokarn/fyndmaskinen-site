import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';

import PageContainer from './PageContainer';
import ResultCard from './ResultCard';

const FIND_LIMIT = 4;
const SKELETON_KEYS = [
    'a',
    'b',
    'c',
    'd',
];

const LandingFinds = ({
    isLoading,
    items,
}) => {
    const visibleItems = items.slice(0, FIND_LIMIT);

    if (!isLoading && visibleItems.length === 0) {
        return null;
    }

    return (
        <Box
            component = 'section'
            sx = {{
                paddingTop: {
                    md: 7,
                    sm: 5,
                    xs: 4,
                },
            }}
        >
            <PageContainer>
                <Stack
                    spacing = {0.5}
                    sx = {{
                        marginBottom: {
                            sm: 3,
                            xs: 2,
                        },
                    }}
                >
                    <Typography
                        component = 'h2'
                        variant = 'h2'
                    >
                        {'Färska fynd'}
                    </Typography>
                    <Typography
                        color = 'text.secondary'
                    >
                        {'Ett urval av det som just nu dyker upp på marknadsplatserna.'}
                    </Typography>
                </Stack>
                <Grid
                    container
                    spacing = {{
                        sm: 1.5,
                        xs: 1,
                    }}
                >
                    {isLoading && SKELETON_KEYS.map((skeletonKey) => {
                        return (
                            <Grid
                                item
                                key = {skeletonKey}
                                lg = {3}
                                sm = {6}
                                xs = {12}
                            >
                                <Skeleton
                                    sx = {{
                                        borderRadius: 3,
                                        height: {
                                            sm: 320,
                                            xs: 132,
                                        },
                                    }}
                                    variant = 'rounded'
                                />
                            </Grid>
                        );
                    })}
                    {!isLoading && visibleItems.map((item) => {
                        return (
                            <Grid
                                item
                                key = {item.url}
                                lg = {3}
                                sm = {6}
                                xs = {12}
                            >
                                <ResultCard
                                    item = {item}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </PageContainer>
        </Box>
    );
};

LandingFinds.propTypes = {
    isLoading: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
        currentPrice: PropTypes.number.isRequired,
        imageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    })),
};

LandingFinds.defaultProps = {
    isLoading: false,
    items: [],
};

export default LandingFinds;
