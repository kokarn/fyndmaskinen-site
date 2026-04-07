import {
    useCallback,
    useRef,
    useState,
} from 'react';
import {
    Alert,
    Box,
    Button,
    Typography,
} from '@mui/material';
import {
    useLocation,
} from 'react-router-dom';

import BarcodeScanner from '../../components/barcode-scanner';
import {
    BarcodeVariantLinks,
    BokborsenResults,
    CameraSelector,
    ImageDecodeInput,
    useBokborsenResults,
    useVideoDevices,
} from './shared';

const QuaggaBarcodePage = () => {
    const location = useLocation();
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
        localError,
        setLocalError,
    ] = useState('');
    const {
        cameraError,
        cameras,
        selectedCamera,
        setSelectedCamera,
    } = useVideoDevices();

    const {
        data: results,
        error,
        isError,
        isFetching,
    } = useBokborsenResults(detectedCode);

    const startScanning = useCallback(() => {
        lastDetectedRef.current = '';
        setLocalError('');
        setDetectedCode('');
        setScanning(true);
    }, []);

    const handleScanToggle = useCallback(() => {
        if (scanning) {
            setScanning(false);

            return;
        }

        startScanning();
    }, [scanning, startScanning]);

    const handleDetected = useCallback((code) => {
        if (!code || code === lastDetectedRef.current) {
            return;
        }

        lastDetectedRef.current = code;
        setDetectedCode(code);
        setScanning(false);
    }, []);

    const handleCameraChange = useCallback((event) => {
        setSelectedCamera(event.target.value);
    }, [setSelectedCamera]);

    const handleImageDecode = useCallback(() => {
        setLocalError('Quagga-varianten stödjer livekamera här. Testa bild via ZXing/Html5Qrcode.');
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
                {'Barcode test: Quagga'}
            </Typography>
            <Typography
                color = '#fff'
                sx = {{
                    marginBottom: 1,
                    marginTop: 1,
                    textShadow: '0 0 4px black',
                }}
                variant = 'body1'
            >
                {'Skanna ISBN med Quagga och slå upp i /bokborsen/:isbn.'}
            </Typography>
            <BarcodeVariantLinks
                activePath = {location.pathname}
            />

            <Box
                sx = {{
                    display: 'flex',
                    gap: 1,
                    marginBottom: 2,
                }}
            >
                <Button
                    onClick = {handleScanToggle}
                    variant = 'contained'
                >
                    {scanning
                        ? 'Stoppa skanning'
                        : 'Starta skanning'}
                </Button>
                <ImageDecodeInput
                    onChange = {handleImageDecode}
                />
            </Box>

            {detectedCode && (
                <Typography
                    color = '#fff'
                    sx = {{
                        fontWeight: 600,
                        marginBottom: 1,
                        textShadow: '0 0 4px black',
                    }}
                    variant = 'body1'
                >
                    {`Skannad kod: ${detectedCode}`}
                </Typography>
            )}

            {(cameraError || localError) && (
                <Alert
                    severity = 'error'
                    sx = {{
                        marginBottom: 2,
                    }}
                >
                    {cameraError || localError}
                </Alert>
            )}

            <CameraSelector
                cameras = {cameras}
                onChange = {handleCameraChange}
                selectedCamera = {selectedCamera}
            />

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

            <BokborsenResults
                detectedCode = {detectedCode}
                error = {error}
                isError = {isError}
                isFetching = {isFetching}
                results = {results}
            />
        </Box>
    );
};

export default QuaggaBarcodePage;
