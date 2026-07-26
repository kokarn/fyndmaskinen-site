import PropTypes from 'prop-types';
import {
    Box,
    Stack,
} from '@mui/material';

import Brand from './Brand';
import AccountActions from './AccountActions';
import PageContainer from './PageContainer';

const AppShell = ({
    children,
}) => {
    return (
        <Box
            sx = {{
                backgroundColor: 'background.default',
                minHeight: '100svh',
            }}
        >
            <Box
                component = 'header'
                sx = {{
                    backgroundColor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'border.subtle',
                }}
            >
                <PageContainer>
                    <Stack
                        alignItems = 'center'
                        direction = 'row'
                        justifyContent = 'space-between'
                        minHeight = {{
                            sm: 72,
                            xs: 60,
                        }}
                    >
                        <Brand />
                        <AccountActions />
                    </Stack>
                </PageContainer>
            </Box>
            <Box
                component = 'main'
            >
                {children}
            </Box>
        </Box>
    );
};

AppShell.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppShell;
