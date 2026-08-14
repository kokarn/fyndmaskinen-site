import PropTypes from 'prop-types';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';
import {
    alpha,
} from '@mui/material/styles';

import PageContainer from './PageContainer';
import SearchBox from './SearchBox';

const GRADIENT_ACCENT_OPACITY = 0.22;
const GRADIENT_FADE_OPACITY = 0.05;

const LandingHero = ({
    filterAction,
    footer,
    mobileAction,
    onSearch,
}) => {
    return (
        <Box
            sx = {{
                background: (theme) => {
                    return 'radial-gradient(135% 105% at 50% -25%, '
                        + `${alpha(theme.palette.primary.main, GRADIENT_ACCENT_OPACITY)}, `
                        + `${alpha(theme.palette.primary.main, GRADIENT_FADE_OPACITY)} 46%, `
                        + `${theme.palette.background.default} 74%)`;
                },
                borderBottom: '1px solid',
                borderColor: 'border.subtle',
                paddingBottom: {
                    md: 8,
                    sm: 6,
                    xs: 4.5,
                },
                paddingTop: {
                    md: 9,
                    sm: 7,
                    xs: 5,
                },
            }}
        >
            <PageContainer
                sx = {{
                    maxWidth: 920,
                }}
            >
                <Stack
                    alignItems = 'center'
                    spacing = {{
                        sm: 3,
                        xs: 2.25,
                    }}
                    textAlign = 'center'
                >
                    <Typography
                        color = 'secondary.main'
                        fontSize = '0.78rem'
                        fontWeight = {850}
                        letterSpacing = '0.09em'
                    >
                        {'FYNDA BEGAGNAT – UTAN ATT LETA PÅ TIO STÄLLEN'}
                    </Typography>
                    <Typography
                        component = 'h1'
                        maxWidth = {760}
                        variant = 'h1'
                    >
                        {'Sök begagnat överallt samtidigt.'}
                    </Typography>
                    <Typography
                        color = 'secondary.main'
                        fontSize = {{
                            sm: '1.15rem',
                            xs: '1rem',
                        }}
                        maxWidth = {620}
                    >
                        {'En sökning visar annonser och auktioner från Sveriges största marknadsplatser.'}
                    </Typography>
                    <Box
                        sx = {{
                            maxWidth: 760,
                            paddingTop: {
                                sm: 1.5,
                                xs: 0.5,
                            },
                            width: '100%',
                        }}
                    >
                        <SearchBox
                            desktopAction = {filterAction}
                            mobileAction = {mobileAction}
                            onSearch = {onSearch}
                            rounded
                        />
                    </Box>
                    {footer && (
                        <Box
                            sx = {{
                                paddingTop: {
                                    sm: 1,
                                    xs: 0.5,
                                },
                                width: '100%',
                            }}
                        >
                            {footer}
                        </Box>
                    )}
                </Stack>
            </PageContainer>
        </Box>
    );
};

LandingHero.propTypes = {
    filterAction: PropTypes.node,
    footer: PropTypes.node,
    mobileAction: PropTypes.node,
    onSearch: PropTypes.func.isRequired,
};

LandingHero.defaultProps = {
    filterAction: null,
    footer: null,
    mobileAction: null,
};

export default LandingHero;
