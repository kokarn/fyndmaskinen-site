import PropTypes from 'prop-types';
import {
    ThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './design-system/theme';

const V2Provider = ({
    children,
}) => {
    return (
        <ThemeProvider
            theme = {theme}
        >
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

V2Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default V2Provider;
