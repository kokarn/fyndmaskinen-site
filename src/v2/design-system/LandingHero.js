import PropTypes from 'prop-types';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';

import PageContainer from './PageContainer';
import SearchBox from './SearchBox';

const LandingHero = ({
    onSearch,
}) => {
    return (
        <Box
            sx = {{
                backgroundColor: 'secondary.light',
                borderBottom: '1px solid',
                borderColor: 'rgba(18, 58, 51, 0.08)',
                paddingBottom: {
                    md: 10,
                    sm: 8,
                    xs: 5,
                },
                paddingTop: {
                    md: 10,
                    sm: 8,
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
                    alignItems = {{
                        sm: 'center',
                        xs: 'flex-start',
                    }}
                    spacing = {{
                        sm: 3,
                        xs: 2.25,
                    }}
                    textAlign = {{
                        sm: 'center',
                        xs: 'left',
                    }}
                >
                    <Typography
                        color = 'text.secondary'
                        fontSize = '0.78rem'
                        fontWeight = {850}
                        letterSpacing = '0.09em'
                    >
                        {'SÖK PÅ HELA ANDRAHANDSMARKNADEN'}
                    </Typography>
                    <Typography
                        component = 'h1'
                        maxWidth = {760}
                        variant = 'h1'
                    >
                        {'Hitta det du letar efter.'}
                    </Typography>
                    <Typography
                        color = 'text.secondary'
                        fontSize = {{
                            sm: '1.15rem',
                            xs: '1rem',
                        }}
                        maxWidth = {650}
                    >
                        {'En sökning visar annonser och auktioner från Sveriges största marknadsplatser.'}
                    </Typography>
                    <Box
                        sx = {{
                            paddingTop: {
                                sm: 1.5,
                                xs: 0.5,
                            },
                            width: '100%',
                        }}
                    >
                        <SearchBox
                            onSearch = {onSearch}
                        />
                    </Box>
                </Stack>
            </PageContainer>
        </Box>
    );
};

LandingHero.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default LandingHero;
