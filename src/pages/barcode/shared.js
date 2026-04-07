import PropTypes from 'prop-types';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    useEffect,
    useState,
} from 'react';
import {
    Link as RouterLink,
} from 'react-router-dom';
import {
    useQuery,
} from 'react-query';

const FALLBACK_NO_IMAGE = 'https://fyndmaskinen.se/images/no-image.jpg';

export const barcodeVariants = [
    {
        id: 'quagga',
        label: 'Quagga',
        path: '/barcode/quagga',
    },
    {
        id: 'zxing',
        label: 'ZXing',
        path: '/barcode/zxing',
    },
    {
        id: 'html5-qrcode',
        label: 'Html5Qrcode',
        path: '/barcode/html5-qrcode',
    },
];

export const normalizeBokborsenResults = (payload) => {
    const rawItems = payload?.items || payload?.results || payload?.data || payload;
    const normalizedItems = Array.isArray(rawItems)
        ? rawItems
        : [];

    return normalizedItems.map((item, index) => {
        return {
            author: item?.author || '',
            id: item?.id || item?.isbn || item?.url || `${index}`,
            imageUrl: item?.imageUrl || item?.image || item?.thumbnail || '',
            isbn: item?.isbn || item?.ISBN || '',
            price: item?.price || item?.currentPrice || '',
            title: item?.title || item?.name || 'Okänd titel',
            url: item?.url || item?.link || '',
        };
    });
};

const fetchBokborsenByIsbn = async ({
    queryKey,
}) => {
    const isbn = queryKey[ 1 ];

    if (!isbn) {
        return [];
    }

    const response = await fetch(`${window.API_HOSTNAME}/bokborsen/${encodeURIComponent(isbn)}`);

    if (!response.ok) {
        throw new Error(`Kunde inte hämta Bokbörsen-resultat (${response.status}).`);
    }

    const payload = await response.json();

    return normalizeBokborsenResults(payload);
};

export const useBokborsenResults = (detectedCode) => {
    return useQuery([
        'bokborsen',
        detectedCode,
    ], fetchBokborsenByIsbn, {
        enabled: detectedCode.length > 0,
        placeholderData: [],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export const useVideoDevices = () => {
    const [
        cameraError,
        setCameraError,
    ] = useState('');
    const [
        cameras,
        setCameras,
    ] = useState([]);
    const [
        selectedCamera,
        setSelectedCamera,
    ] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadCameras = async () => {
            if (!navigator?.mediaDevices?.enumerateDevices) {
                setCameraError('Din enhet stödjer inte kameraåtkomst i webbläsaren.');

                return;
            }

            try {
                const mediaDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = mediaDevices.filter((device) => {
                    return device.kind === 'videoinput';
                });

                if (!isMounted) {
                    return;
                }

                setCameras(videoDevices);
                setSelectedCamera((currentDeviceId) => {
                    return currentDeviceId || videoDevices[ 0 ]?.deviceId || '';
                });
            } catch (error) {
                setCameraError('Kunde inte läsa tillgängliga kameror.');
                console.error(error);
            }
        };

        loadCameras();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        cameraError,
        cameras,
        selectedCamera,
        setSelectedCamera,
    };
};

export const BarcodeVariantLinks = ({
    activePath,
}) => {
    return (
        <Box
            sx = {{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                marginBottom: 2,
                marginTop: 1,
            }}
        >
            {barcodeVariants.map((variant) => {
                return (
                    <Button
                        color = 'secondary'
                        component = {RouterLink}
                        key = {variant.id}
                        to = {variant.path}
                        variant = {variant.path === activePath ? 'contained' : 'outlined'}
                    >
                        {variant.label}
                    </Button>
                );
            })}
        </Box>
    );
};

BarcodeVariantLinks.propTypes = {
    activePath: PropTypes.string.isRequired,
};

export const CameraSelector = ({
    cameras,
    onChange,
    selectedCamera,
}) => {
    if (cameras.length <= 1) {
        return null;
    }

    return (
        <FormControl
            fullWidth
            size = 'small'
            sx = {{
                backgroundColor: '#fff',
                marginBottom: 2,
                maxWidth: 380,
            }}
        >
            <InputLabel
                id = 'barcode-camera-select-label'
            >
                {'Kamera'}
            </InputLabel>
            <Select
                id = 'barcode-camera-select'
                label = 'Kamera'
                labelId = 'barcode-camera-select-label'
                onChange = {onChange}
                value = {selectedCamera}
            >
                {cameras.map((camera, index) => {
                    return (
                        <MenuItem
                            key = {camera.deviceId}
                            value = {camera.deviceId}
                        >
                            {camera.label || `Kamera ${index + 1}`}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

CameraSelector.propTypes = {
    cameras: PropTypes.arrayOf(PropTypes.shape({
        deviceId: PropTypes.string,
        label: PropTypes.string,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    selectedCamera: PropTypes.string.isRequired,
};

export const ImageDecodeInput = ({
    onChange,
}) => {
    return (
        <Button
            color = 'secondary'
            component = 'label'
            variant = 'outlined'
        >
            {'Testa med bild'}
            <input
                accept = 'image/*'
                hidden
                onChange = {onChange}
                type = 'file'
            />
        </Button>
    );
};

ImageDecodeInput.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export const BokborsenResults = ({
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
