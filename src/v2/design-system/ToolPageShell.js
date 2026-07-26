import PropTypes from 'prop-types';
import {
    Box,
} from '@mui/material';

import AccountPageShell from './AccountPageShell';

const ToolPageShell = ({
    children,
    description,
    title,
}) => {
    return (
        <AccountPageShell
            description = {description}
            title = {title}
        >
            <Box
                sx = {{
                    '& .MuiTableContainer-root': {
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'border.subtle',
                        borderRadius: 2,
                    },
                    '& .MuiTypography-root': {
                        color: 'text.primary',
                        textShadow: 'none !important',
                    },
                    '& > .MuiBox-root': {
                        marginTop: '0 !important',
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6, & p': {
                        textShadow: 'none !important',
                    },
                    '& video, & canvas': {
                        borderRadius: 2,
                        maxWidth: '100%',
                    },
                }}
            >
                {children}
            </Box>
        </AccountPageShell>
    );
};

ToolPageShell.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default ToolPageShell;
