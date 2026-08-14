import PropTypes from 'prop-types';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';

const DesignSwatch = ({
    color,
    label,
}) => {
    return (
        <Stack
            spacing = {1}
        >
            <Box
                sx = {{
                    backgroundColor: color,
                    border: '1px solid',
                    borderColor: 'border.strong',
                    borderRadius: 2,
                    height: 72,
                }}
            />
            <Typography
                fontWeight = {750}
            >
                {label}
            </Typography>
            <Typography
                color = 'text.secondary'
                fontSize = '0.78rem'
            >
                {color}
            </Typography>
        </Stack>
    );
};

DesignSwatch.propTypes = {
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default DesignSwatch;
