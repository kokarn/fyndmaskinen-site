import PropTypes from 'prop-types';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';

const DesignSection = ({
    children,
    description,
    title,
}) => {
    return (
        <Stack
            component = 'section'
            spacing = {3}
        >
            <Box>
                <Typography
                    component = 'h2'
                    variant = 'h2'
                >
                    {title}
                </Typography>
                <Typography
                    color = 'text.secondary'
                    marginTop = {0.75}
                >
                    {description}
                </Typography>
            </Box>
            {children}
        </Stack>
    );
};

DesignSection.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default DesignSection;
