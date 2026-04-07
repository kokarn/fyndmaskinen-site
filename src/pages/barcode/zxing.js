import {
    BrowserCodeReader,
    BrowserMultiFormatReader,
} from '@zxing/browser';
import {
    BarcodeFormat,
    DecodeHintType,
} from '@zxing/library';
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

const ZXingBarcodePage = () => {
    const location = useLocation();
    const videoRef = useRef(null);
    const controlsRef = useRef(null);
    const readerRef = useRef(null);
    const lastDetectedRef = useRef('');
    const [
        detectedCode,
        setDetectedCode,
    ] = useState('');
    const [
        scanning,
        setScanning,
    ] = useState(false);
    const [
        localError,
        setLocalError,
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
        data: results,
        error,
        isError,
        isFetching,
    } = useBokborsenResults(detectedCode);

    const hints = useMemo(() => {
        const newHints = new Map();

        newHints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
        ]);

        return newHints;
    }, []);

    const stopScanning = useCallback(() => {
        controlsRef.current?.stop();
        controlsRef.current = null;
        setScanning(false);
    }, []);

    const startScanning = useCallback(async () => {
        if (!videoRef.current) {
            return;
        }

        setLocalError('');
        setDetectedCode('');
        lastDetectedRef.current = '';
        setScanning(true);

        try {
            if (!readerRef.current) {
                readerRef.current = new BrowserMultiFormatReader(hints);
            }

            const controls = await readerRef.current.decodeFromVideoDevice(
                selectedCamera || '',
                videoRef.current,
                (result, decodeError) => {
                    if (result?.getText) {
                        const code = result.getText();

                        if (code && code !== lastDetectedRef.current) {
                            lastDetectedRef.current = code;
                            setDetectedCode(code);
                            stopScanning();
                        }
                    } else if (decodeError && decodeError.name !== 'NotFoundException') {
                        setLocalError(decodeError.message || 'ZXing kunde inte läsa koden.');
                    }
                },
            );

            controlsRef.current = controls;
        } catch (startError) {
            setLocalError(startError.message || 'Kunde inte starta ZXing-scannern.');
            setScanning(false);
        }
    }, [
        hints,
        selectedCamera,
        stopScanning,
    ]);

    const handleScanToggle = useCallback(() => {
        if (scanning) {
            stopScanning();

            return;
        }

        startScanning();
    }, [
        scanning,
        startScanning,
        stopScanning,
    ]);

    const handleCameraChange = useCallback((event) => {
        setSelectedCamera(event.target.value);
    }, [setSelectedCamera]);

    const handleImageDecode = useCallback((event) => {
        const nextFile = event.target.files?.[ 0 ];

        if (!nextFile) {
            return;
        }

        setSelectedTestFile(nextFile);
        setLocalError('');
        setDetectedCode('');
        clearInputValue(event.target);
    }, []);

    useEffect(() => {
        const decodeImage = async () => {
            if (!selectedTestFile) {
                return;
            }

            const imageUrl = URL.createObjectURL(selectedTestFile);

            try {
                const reader = readerRef.current || new BrowserMultiFormatReader(hints);

                readerRef.current = reader;
                const result = await reader.decodeFromImageUrl(imageUrl);

                if (result?.getText) {
                    setDetectedCode(result.getText());
                } else {
                    setLocalError('Ingen kod hittades i bilden.');
                }
            } catch (decodeImageError) {
                setLocalError(decodeImageError.message || 'ZXing kunde inte tolka testbilden.');
            }

            URL.revokeObjectURL(imageUrl);
            setSelectedTestFile(null);
        };

        decodeImage();
    }, [
        hints,
        selectedTestFile,
    ]);

    useEffect(() => {
        return () => {
            controlsRef.current?.stop();
            BrowserCodeReader.releaseAllStreams();
        };
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
                {'Barcode test: ZXing'}
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
                {'Skanna ISBN med ZXing. Du kan även testa uppladdad bild.'}
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
                    padding: 1,
                }}
            >
                <video
                    muted
                    playsInline
                    ref = {videoRef}
                    style = {{
                        display: 'block',
                        maxWidth: '100%',
                        width: '100%',
                    }}
                />
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

export default ZXingBarcodePage;
