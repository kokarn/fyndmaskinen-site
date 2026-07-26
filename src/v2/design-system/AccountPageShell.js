import PropTypes from 'prop-types';
import {
    Stack,
    Typography,
} from '@mui/material';
import {
    Helmet,
} from 'react-helmet';

import AppShell from './AppShell';
import PageContainer from './PageContainer';

const AccountPageShell = ({
    children,
    description,
    title,
}) => {
    return (
        <AppShell>
            <Helmet>
                <title>
                    {`${title} – Fyndmaskinen`}
                </title>
            </Helmet>
            <PageContainer
                sx = {{
                    paddingBottom: 8,
                    paddingTop: {
                        md: 6,
                        xs: 4,
                    },
                }}
            >
                <Stack
                    spacing = {1}
                    sx = {{
                        marginBottom: 4,
                    }}
                >
                    <Typography
                        component = 'h1'
                        variant = 'h2'
                    >
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            color = 'text.secondary'
                            variant = 'body1'
                        >
                            {description}
                        </Typography>
                    )}
                </Stack>
                {children}
            </PageContainer>
        </AppShell>
    );
};

AccountPageShell.defaultProps = {
    description: '',
};

AccountPageShell.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
};

export default AccountPageShell;
