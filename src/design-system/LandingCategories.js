import {
    useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
    ButtonBase,
    Stack,
    Typography,
} from '@mui/material';

const LandingCategories = ({
    categories,
    onSelect,
}) => {
    const handleSelect = useCallback((event) => {
        onSelect(event.currentTarget.dataset.term);
    }, [ onSelect ]);

    return (
        <Stack
            direction = 'row'
            flexWrap = 'wrap'
            sx = {{
                display: 'grid',
                gap: {
                    sm: 1.5,
                    xs: 1,
                },
                gridTemplateColumns: {
                    md: 'repeat(6, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    xs: 'repeat(2, 1fr)',
                },
            }}
        >
            {categories.map((category) => {
                return (
                    <ButtonBase
                        data-term = {category.term}
                        key = {category.id}
                        onClick = {handleSelect}
                        sx = {{
                            '&:hover': {
                                borderColor: 'primary.main',
                                transform: 'translateY(-2px)',
                            },
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'border.subtle',
                            borderRadius: 3,
                            flexDirection: 'column',
                            gap: 1,
                            paddingX: 1.5,
                            paddingY: {
                                sm: 2,
                                xs: 1.75,
                            },
                            transition: 'transform 0.15s ease, border-color 0.15s ease',
                            width: '100%',
                        }}
                    >
                        <Stack
                            alignItems = 'center'
                            justifyContent = 'center'
                            sx = {{
                                backgroundColor: 'surface.hero',
                                borderRadius: 2,
                                color: 'secondary.main',
                                height: 44,
                                width: 44,
                            }}
                        >
                            {category.icon}
                        </Stack>
                        <Typography
                            fontSize = '0.88rem'
                            fontWeight = {750}
                        >
                            {category.label}
                        </Typography>
                    </ButtonBase>
                );
            })}
        </Stack>
    );
};

LandingCategories.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.node.isRequired,
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        term: PropTypes.string.isRequired,
    })).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default LandingCategories;
