import PropTypes from 'prop-types';
import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const FALLBACK_NO_IMAGE = 'https://fyndmaskinen.se/images/no-image.jpg';

const BokborsenResults = ({
    detectedCode,
    error,
    isError,
    isFetching,
    results,
}) => {
    if (isFetching) {
        return (
            <Box
                sx = {{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 1,
                    marginBottom: 2,
                }}
            >
                <CircularProgress
                    color = 'secondary'
                    size = {24}
                />
                <Typography
                    color = '#fff'
                    sx = {{
                        textShadow: '0 0 4px black',
                    }}
                    variant = 'body1'
                >
                    {'Söker i Bokbörsen...'}
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert
                severity = 'error'
            >
                {error.message}
            </Alert>
        );
    }

    if (detectedCode && results?.length === 0) {
        return (
            <Alert
                severity = 'info'
            >
                {'Inga böcker hittades för det skannade ISBN-numret.'}
            </Alert>
        );
    }

    if (!results?.length) {
        return null;
    }

    return (
        <Grid
            container
            spacing = {2}
            sx = {{
                marginTop: 3,
            }}
        >
            {results.map((book) => {
                return (
                    <Grid
                        key = {book.id}
                        md = {4}
                        sm = {6}
                        xs = {12}
                    >
                        <Card>
                            <CardActionArea
                                href = {book.url}
                                rel = 'noopener noreferrer'
                                target = '_blank'
                            >
                                <CardMedia
                                    alt = {book.title}
                                    component = 'img'
                                    height = '220'
                                    image = {book.imageUrl || FALLBACK_NO_IMAGE}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant = 'h6'
                                    >
                                        {book.title}
                                    </Typography>
                                    {book.author && (
                                        <Typography
                                            color = 'text.secondary'
                                            variant = 'body2'
                                        >
                                            {`Författare: ${book.author}`}
                                        </Typography>
                                    )}
                                    {book.isbn && (
                                        <Typography
                                            color = 'text.secondary'
                                            variant = 'body2'
                                        >
                                            {`ISBN: ${book.isbn}`}
                                        </Typography>
                                    )}
                                    {book.price && (
                                        <Typography
                                            sx = {{
                                                fontWeight: 700,
                                                marginTop: 1,
                                            }}
                                            variant = 'body1'
                                        >
                                            {book.price}
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

BokborsenResults.defaultProps = {
    error: null,
    results: [],
};

BokborsenResults.propTypes = {
    detectedCode: PropTypes.string.isRequired,
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
    isError: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        author: PropTypes.string,
        id: PropTypes.string,
        imageUrl: PropTypes.string,
        isbn: PropTypes.string,
        price: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        title: PropTypes.string,
        url: PropTypes.string,
    })),
};

export default BokborsenResults;
