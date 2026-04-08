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
    Typography,
} from '@mui/material';
import {
    Html5Qrcode,
    Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import {
    useLocation,
} from 'react-router-dom';

import {
    BarcodeVariantLinks,
    clearInputValue,
} from './components';
import {
    BokborsenResults,
    CameraSelector,
    ImageDecodeInput,
} from './ui';
import {
    useBokborsenResults,
    useVideoDevices,
} from './shared';

const noop = () => {
    // do nothing
};

const scannerRegionId = 'html5-qrcode-region';

const Html5QrcodePage = () => {
    const location = useLocation();
    const scannerRef = useRef(null);
    const [
        scanning,
        setScanning,
    ] = useState(false);
    const [
        scanError,
        setScanError,
    ] = useState('');
    const [
        detectedCode,
        setDetectedCode,
    ] = useState('');
    const [
        selectedTestFile,
        setSelectedTestFile,
    ] = useState(null);
    const {
        cameraError,
        cameras,
        selectedCamera,
        setSelectedCamera,
    } = useVideoDevices();

    const {
        data: bokborsenResults,
        error,
        isError,
        isFetching,
    } = useBokborsenResults(detectedCode);

    const scannerConfig = useMemo(() => {
        return {
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
            ],
            fps: 10,
        };
    }, []);

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(scannerRegionId);

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch((stopError) => {
                    console.error(stopError);
                });
            }
            scannerRef.current?.clear();
        };
    }, []);

    useEffect(() => {
        if (!scanning || !scannerRef.current) {
            return noop;
        }

        let ignore = false;

        const startScanner = async () => {
            const scanner = scannerRef.current;
            const cameraConfig = selectedCamera
                ? {
                    deviceId: {
                        exact: selectedCamera,
                    },
                }
                : {
                    facingMode: 'environment',
                };

            try {
                await scanner.start(cameraConfig, scannerConfig, (decodedText) => {
                    if (ignore || !decodedText) {
                        return;
                    }

                    setDetectedCode(decodedText);
                    setScanning(false);
                });
            } catch (startError) {
                if (!ignore) {
                    setScanError('Kunde inte starta Html5Qrcode-scannern.');
                    console.error(startError);
                    setScanning(false);
                }
            }
        };

        startScanner();

        return () => {
            ignore = true;
            const scanner = scannerRef.current;

            if (scanner?.isScanning) {
                scanner.stop().catch((stopError) => {
                    console.error(stopError);
                });
            }
        };
    }, [
        scanning,
        scannerConfig,
        selectedCamera,
    ]);

    const handleToggleScanning = useCallback(() => {
        if (scanning) {
            setScanning(false);

            return;
        }

        setDetectedCode('');
        setScanError('');
        setScanning(true);
    }, [scanning]);

    const handleCameraChange = useCallback((event) => {
        setSelectedCamera(event.target.value);
    }, [setSelectedCamera]);

    const handleImageUpload = useCallback((event) => {
        const nextFile = event.target.files?.[ 0 ];

        if (!nextFile) {
            return;
        }

        setSelectedTestFile(nextFile);
        setDetectedCode('');
        setScanError('');
        clearInputValue(event.target);
    }, []);

    useEffect(() => {
        const decodeImage = async () => {
            const scanner = scannerRef.current;

            if (!scanner || !selectedTestFile) {
                return;
            }

            try {
                const decoded = await scanner.scanFile(selectedTestFile, false);

                setDetectedCode(decoded);
                setScanError('');
            } catch (decodeError) {
                setScanError('Ingen streckkod hittades i bilden.');
                console.error(decodeError);
            }

            setSelectedTestFile(null);
        };

        decodeImage();
    }, [selectedTestFile]);

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
                {'Scanner-lab: Html5Qrcode'}
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
                {'Skanna ISBN med Html5Qrcode och slå upp mot /bokborsen/:isbn.'}
            </Typography>

            <BarcodeVariantLinks
                activePath = {location.pathname}
            />

            <Box
                sx = {{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    marginBottom: 2,
                }}
            >
                <Button
                    onClick = {handleToggleScanning}
                    variant = 'contained'
                >
                    {scanning
                        ? 'Stoppa skanning'
                        : 'Starta skanning'}
                </Button>
                <ImageDecodeInput
                    onChange = {handleImageUpload}
                />
            </Box>

            {detectedCode && (
                <Typography
                    color = '#fff'
                    sx = {{
                        fontWeight: 600,
                        marginBottom: 2,
                        textShadow: '0 0 4px black',
                    }}
                    variant = 'body1'
                >
                    {`Skannad kod: ${detectedCode}`}
                </Typography>
            )}

            <CameraSelector
                cameras = {cameras}
                onChange = {handleCameraChange}
                selectedCamera = {selectedCamera}
            />

            <Box
                sx = {{
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    marginBottom: 2,
                    maxWidth: 640,
                    minHeight: 240,
                    overflow: 'hidden',
                    padding: 1,
                }}
            >
                <div
                    id = {scannerRegionId}
                />
            </Box>

            {(cameraError || scanError) && (
                <Alert
                    severity = 'error'
                    sx = {{
                        marginBottom: 2,
                    }}
                >
                    {cameraError || scanError}
                </Alert>
            )}

            <BokborsenResults
                detectedCode = {detectedCode}
                error = {error}
                isError = {isError}
                isFetching = {isFetching}
                results = {bokborsenResults}
            />
        </Box>
    );
};

export default Html5QrcodePage;
