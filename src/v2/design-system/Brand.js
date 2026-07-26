import {
    Link,
} from 'react-router-dom';
import {
    Box,
    Stack,
    Typography,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

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
            to = '/v2'
        >
            <Box
                sx = {{
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    color: 'primary.contrastText',
                    display: 'flex',
                    height: 32,
                    justifyContent: 'center',
                    width: 32,
                }}
            >
                <DoneIcon
                    fontSize = 'small'
                />
            </Box>
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
