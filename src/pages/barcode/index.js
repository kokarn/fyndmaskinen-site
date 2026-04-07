import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    useQuery,
} from 'react-query';

import BarcodeScanner from '../../components/barcode-scanner';
import SearchTable from '../../components/search-table';
import doSearch from '../../features/search';
import sources from '../../sources';

const Barcode = () => {
    const scannerRef = useRef(null);
    const lastDetectedRef = useRef('');
    const [
        scanning,
        setScanning,
    ] = useState(false);
    const [
        detectedCode,
        setDetectedCode,
    ] = useState('');
    const [
        scanError,
        setScanError,
    ] = useState('');
    const [
        cameras,
        setCameras,
    ] = useState([]);
    const [
        selectedCamera,
        setSelectedCamera,
    ] = useState('');

    const enabledSources = useMemo(() => {
        return sources.map((source) => {
            return source.id;
        });
    }, []);

    const {
        data: searchResult,
        isFetching,
    } = useQuery([
        'search',
        detectedCode,
        enabledSources,
    ], doSearch, {
        enabled: detectedCode.length > 0,
        placeholderData: [],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        let isMounted = true;

        const loadCameras = async () => {
            if (!navigator?.mediaDevices?.enumerateDevices) {
                setScanError('Din enhet stödjer inte kameraåtkomst i webbläsaren.');

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

                if (videoDevices.length > 0) {
                    setSelectedCamera((currentDeviceId) => {
                        return currentDeviceId || videoDevices[ 0 ].deviceId;
                    });
                }
            } catch (cameraError) {
                setScanError('Kunde inte läsa tillgängliga kameror.');
                console.error(cameraError);
            }
        };

        loadCameras();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDetected = useCallback((code) => {
        if (!code || code === lastDetectedRef.current) {
            return;
        }

        lastDetectedRef.current = code;
        setDetectedCode(code);
        setScanning(false);
    }, []);

    const startScanning = () => {
        lastDetectedRef.current = '';
        setScanError('');
        setDetectedCode('');
        setScanning(true);
    };

    const handleScanToggle = useCallback(() => {
        if (scanning) {
            setScanning(false);

            return;
        }

        startScanning();
    }, [scanning]);

    const handleCameraChange = useCallback((event) => {
        setSelectedCamera(event.target.value);
    }, []);

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
                {'Skanna streckkod'}
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
                {'Skanna en EAN/UPC-kod så söker vi automatiskt i Fyndmaskinens API.'}
            </Typography>

            <Grid
                alignItems = 'center'
                container
                spacing = {2}
                sx = {{
                    marginBottom: 2,
                }}
            >
                <Grid>
                    <Button
                        onClick = {handleScanToggle}
                        variant = 'contained'
                    >
                        {scanning
                            ? 'Stoppa skanning'
                            : 'Starta skanning'}
                    </Button>
                </Grid>
                {detectedCode && (
                    <Grid>
                        <Typography
                            color = '#fff'
                            sx = {{
                                fontWeight: 600,
                                textShadow: '0 0 4px black',
                            }}
                            variant = 'body1'
                        >
                            {`Skannad kod: ${detectedCode}`}
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {cameras.length > 1 && (
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
                        onChange = {handleCameraChange}
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
            )}

            <Box
                sx = {{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    borderRadius: 2,
                    marginBottom: 3,
                    maxWidth: 640,
                    minHeight: 200,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Box
                    ref = {scannerRef}
                    sx = {{
                        minHeight: 200,
                        position: 'relative',
                    }}
                >
                    <canvas
                        className = 'drawingBuffer'
                        height = '480'
                        style = {{
                            left: 0,
                            pointerEvents: 'none',
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                        }}
                        width = '640'
                    />
                    {scanning && (
                        <BarcodeScanner
                            cameraId = {selectedCamera}
                            decoders = {[
                                'ean_reader',
                                'ean_8_reader',
                                'upc_reader',
                                'upc_e_reader',
                            ]}
                            facingMode = 'environment'
                            onDetected = {handleDetected}
                            scannerRef = {scannerRef}
                        />
                    )}
                </Box>
            </Box>

            {scanError && (
                <Alert
                    severity = 'error'
                    sx = {{
                        marginBottom: 2,
                    }}
                >
                    {scanError}
                </Alert>
            )}

            {isFetching && (
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
                        {'Söker efter skannad kod...'}
                    </Typography>
                </Box>
            )}

            {!isFetching && detectedCode && searchResult?.length === 0 && (
                <Alert
                    severity = 'info'
                >
                    {'Inga objekt hittades för den skannade streckkoden.'}
                </Alert>
            )}

            {!isFetching && searchResult?.length > 0 && (
                <Grid
                    columns = {{
                        sm: 5,
                        xl: 6,
                        xs: 2,
                    }}
                    container
                    justifyContent = 'center'
                    spacing = {2}
                    sx = {{
                        marginTop: 3,
                    }}
                >
                    <SearchTable
                        displayItems = {searchResult}
                    />
                </Grid>
            )}
        </Box>
    );
};

export default Barcode;
