import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Link as RouterLink,
} from 'react-router-dom';

import {
    barcodeVariants,
} from './shared';

const Barcode = () => {
    return (
        <Box
            sx = {{
                marginBottom: 6,
                marginTop: 4,
            }}
        >
            <Typography
                color = '#fff'
                sx = {{
                    fontWeight: 700,
                    textShadow: '0 0 4px black',
                }}
                variant = 'h4'
            >
                {'Scanner-lab'}
            </Typography>
            <Typography
                color = '#fff'
                sx = {{
                    marginBottom: 3,
                    marginTop: 1,
                    textShadow: '0 0 4px black',
                }}
                variant = 'body1'
            >
                {'Jämför olika streckkodsramverk. Alla varianter söker mot API:et /bokborsen/:isbn.'}
            </Typography>
            <Grid
                container
                spacing = {2}
            >
                {barcodeVariants.map((variant) => {
                    return (
                        <Grid
                            key = {variant.id}
                            md = {4}
                            sm = {6}
                            xs = {12}
                        >
                            <Card>
                                <CardActionArea
                                    component = {RouterLink}
                                    to = {variant.path}
                                >
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant = 'h6'
                                        >
                                            {variant.label}
                                        </Typography>
                                        <Typography
                                            color = 'text.secondary'
                                            variant = 'body2'
                                        >
                                            {`Testa scanner-implementering: ${variant.label}`}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Barcode;
