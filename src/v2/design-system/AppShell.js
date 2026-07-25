import PropTypes from 'prop-types';
import {
    Link,
} from 'react-router-dom';
import {
    Box,
    Button,
    Stack,
} from '@mui/material';

import Brand from './Brand';
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
                    borderColor: 'rgba(18, 58, 51, 0.08)',
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
                        <Stack
                            alignItems = 'center'
                            direction = 'row'
                            spacing = {1}
                        >
                            <Button
                                component = {Link}
                                sx = {{
                                    display: {
                                        sm: 'inline-flex',
                                        xs: 'none',
                                    },
                                }}
                                to = '/profile'
                                variant = 'text'
                            >
                                {'Bevakningar'}
                            </Button>
                            <Button
                                component = {Link}
                                size = 'small'
                                to = '/profile'
                                variant = 'contained'
                            >
                                {'Logga in'}
                            </Button>
                        </Stack>
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
