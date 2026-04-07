import {
    useCallback,
    useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import Quagga from '@ericblade/quagga2';

const CODE_LABEL_X = 10;
const CODE_LABEL_Y = 20;
const MIN_CONFIDENCE_ERROR = 0.25;
const OVERLAY_LINE_WIDTH = 2;
const PARSE_RADIX = 10;

const defaultConstraints = {
    height: 480,
    width: 640,
};

const defaultLocatorSettings = {
    halfSample: true,
    patchSize: 'medium',
};

const defaultDecoders = [ 'ean_reader' ];

const getMedian = function getMedian (values) {
    const sortedValues = [ ...values ].sort((firstValue, secondValue) => {
        return firstValue - secondValue;
    });
    const halfIndex = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 1) {
        return sortedValues[ halfIndex ];
    }

    return (sortedValues[ halfIndex - 1 ] + sortedValues[ halfIndex ]) / 2;
};

const getMedianOfCodeErrors = function getMedianOfCodeErrors (decodedCodes) {
    const errors = decodedCodes
        .filter((decodedCode) => {
            return typeof decodedCode.error !== 'undefined';
        })
        .map((decodedCode) => {
            return decodedCode.error;
        });

    if (errors.length === 0) {
        return 1;
    }

    return getMedian(errors);
};

const BarcodeScanner = ({
    cameraId,
    constraints,
    decoders,
    facingMode,
    locate,
    locator,
    numOfWorkers,
    onDetected,
    onScannerReady,
    scannerRef,
}) => {
    const handleDetected = useCallback((result) => {
        if (!onDetected) {
            return;
        }

        const codeResult = result?.codeResult;

        if (!codeResult?.decodedCodes?.length) {
            return;
        }

        const medianError = getMedianOfCodeErrors(codeResult.decodedCodes);

        if (medianError < MIN_CONFIDENCE_ERROR) {
            onDetected(codeResult.code);
        }
    }, [onDetected]);

    const handleProcessed = useCallback((result) => {
        const drawingCtx = Quagga.canvas?.ctx?.overlay;
        const drawingCanvas = Quagga.canvas?.dom?.overlay;

        if (!drawingCtx || !drawingCanvas) {
            return;
        }

        drawingCtx.font = '24px Arial';
        drawingCtx.fillStyle = 'green';

        if (!result) {
            return;
        }

        if (result.boxes) {
            drawingCtx.clearRect(
                0,
                0,
                parseInt(drawingCanvas.getAttribute('width'), PARSE_RADIX),
                parseInt(drawingCanvas.getAttribute('height'), PARSE_RADIX),
            );
            result.boxes
                .filter((box) => {
                    return box !== result.box;
                })
                .forEach((box) => {
                    Quagga.ImageDebug.drawPath(
                        box,
                        {
                            x: 0,
                            y: 1,
                        },
                        drawingCtx,
                        {
                            color: 'purple',
                            lineWidth: OVERLAY_LINE_WIDTH,
                        },
                    );
                });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(
                result.box,
                {
                    x: 0,
                    y: 1,
                },
                drawingCtx,
                {
                    color: 'blue',
                    lineWidth: OVERLAY_LINE_WIDTH,
                },
            );
        }

        if (result.codeResult?.code) {
            drawingCtx.fillText(result.codeResult.code, CODE_LABEL_X, CODE_LABEL_Y);
        }
    }, []);

    useLayoutEffect(() => {
        Quagga.init({
            decoder: {
                readers: decoders,
            },
            inputStream: {
                constraints: {
                    ...constraints,
                    ...(!cameraId && {
                        facingMode,
                    }),
                    ...(cameraId && {
                        deviceId: cameraId,
                    }),
                },
                target: scannerRef.current,
                type: 'LiveStream',
            },
            locate,
            locator,
            numOfWorkers,
        }, (error) => {
            if (error) {
                console.error('Error starting Quagga:', error);

                return;
            }

            Quagga.start();

            if (onScannerReady) {
                onScannerReady();
            }
        });

        Quagga.onDetected(handleDetected);
        Quagga.onProcessed(handleProcessed);

        return () => {
            Quagga.offDetected(handleDetected);
            Quagga.offProcessed(handleProcessed);
            Quagga.stop();
        };
    }, [
        cameraId,
        constraints,
        decoders,
        facingMode,
        handleDetected,
        handleProcessed,
        locate,
        locator,
        numOfWorkers,
        onScannerReady,
        scannerRef,
    ]);

    return null;
};

BarcodeScanner.defaultProps = {
    cameraId: '',
    constraints: defaultConstraints,
    decoders: defaultDecoders,
    facingMode: 'environment',
    locate: true,
    locator: defaultLocatorSettings,
    numOfWorkers: navigator.hardwareConcurrency || 0,
    onScannerReady: null,
};

BarcodeScanner.propTypes = {
    cameraId: PropTypes.string,
    constraints: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }),
    decoders: PropTypes.arrayOf(PropTypes.string),
    facingMode: PropTypes.string,
    locate: PropTypes.bool,
    locator: PropTypes.shape({
        halfSample: PropTypes.bool,
        patchSize: PropTypes.string,
    }),
    numOfWorkers: PropTypes.number,
    onDetected: PropTypes.func.isRequired,
    onScannerReady: PropTypes.func,
    scannerRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({
            current: PropTypes.instanceOf(Element),
        }),
    ]).isRequired,
};

export default BarcodeScanner;
