import PropTypes from 'prop-types';
import {
    Box,
} from '@mui/material';

const PageContainer = ({
    children,
    sx,
}) => {
    return (
        <Box
            sx = {{
                marginX: 'auto',
                maxWidth: 1324,
                paddingX: {
                    md: 4,
                    xs: 2,
                },
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

PageContainer.defaultProps = {
    sx: {},
};

PageContainer.propTypes = {
    children: PropTypes.node.isRequired,
    sx: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.shape({}),
    ]),
};

export default PageContainer;
