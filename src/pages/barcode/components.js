import PropTypes from 'prop-types';
import {
    Box,
    Button,
} from '@mui/material';
import {
    Link as RouterLink,
} from 'react-router-dom';

import {
    barcodeVariants,
} from './shared';

const clearInputValue = (inputElement) => {
    try {
        inputElement.value = '';
    } catch (clearError) {
        console.error(clearError);
    }
};

const BarcodeVariantLinks = ({
    activePath,
}) => {
    return (
        <Box
            sx = {{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                marginBottom: 2,
                marginTop: 1,
            }}
        >
            {barcodeVariants.map((variant) => {
                return (
                    <Button
                        color = 'secondary'
                        component = {RouterLink}
                        key = {variant.id}
                        to = {variant.path}
                        variant = {variant.path === activePath
                            ? 'contained'
                            : 'outlined'}
                    >
                        {variant.label}
                    </Button>
                );
            })}
        </Box>
    );
};

BarcodeVariantLinks.propTypes = {
    activePath: PropTypes.string.isRequired,
};


export {
    BarcodeVariantLinks,
    clearInputValue,
};
