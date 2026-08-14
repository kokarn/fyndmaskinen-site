import {
    Link,
} from 'react-router-dom';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';

const Brand = () => {
    return (
        <Stack
            alignItems = 'center'
            color = 'text.primary'
            component = {Link}
            direction = 'row'
            spacing = {1.5}
            sx = {{
                flexShrink: 1,
                minWidth: 0,
                textDecoration: 'none',
            }}
            to = '/'
        >
            <Box
                alt = ''
                aria-hidden = 'true'
                component = 'img'
                src = '/logo192.png'
                sx = {{
                    flexShrink: 0,
                    height: 32,
                    objectFit: 'contain',
                    width: 32,
                }}
            />
            <Typography
                display = {{
                    sm: 'block',
                    xs: 'none',
                }}
                fontSize = {{
                    sm: '1.45rem',
                    xs: '1.2rem',
                }}
                fontWeight = {850}
                letterSpacing = '-0.03em'
            >
                {'Fyndmaskinen'}
            </Typography>
        </Stack>
    );
};

export default Brand;
