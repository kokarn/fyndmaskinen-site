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
                textDecoration: 'none',
            }}
            to = '/v2'
        >
            <Box
                sx = {{
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    color: '#FFFFFF',
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
