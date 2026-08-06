import {
    useEffect,
    useState,
} from 'react';
import {
    useQuery,
} from 'react-query';

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
    let normalizedItems;

    if (Array.isArray(rawItems)) {
        normalizedItems = rawItems;
    } else if (rawItems && typeof rawItems === 'object') {
        normalizedItems = [ rawItems ];
    } else {
        normalizedItems = [];
    }

    return normalizedItems.map((item, index) => {
        return {
            author: item?.author || '',
            conditions: normalizeConditions(item?.conditions),
            id: item?.id || item?.isbn || item?.url || `${index}`,
            imageUrl: item?.imageUrl || item?.image || item?.thumbnail || '',
            isbn: item?.isbn || item?.ISBN || '',
            listingCount: Number(item?.listingCount) || 0,
            price: item?.price || item?.priceLow || item?.currentPrice || '',
            priceHigh: item?.priceHigh || '',
            title: item?.title || item?.name || 'Okänd titel',
            url: item?.url || item?.link || '',
        };
    });
};

// Keep only well-formed condition tiers with a numeric lowest price. The
// backend already sorts them best -> worst, so preserve the incoming order.
export const normalizeConditions = (rawConditions) => {
    if (!Array.isArray(rawConditions)) {
        return [];
    }

    return rawConditions
        .map((tier) => {
            return {
                count: Number(tier?.count) || 0,
                id: tier?.id || '',
                label: tier?.label || '',
                lowestPrice: Number(tier?.lowestPrice),
            };
        })
        .filter((tier) => {
            return tier.id && tier.label && !Number.isNaN(tier.lowestPrice);
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
                    if (currentDeviceId) {
                        return currentDeviceId;
                    }

                    const backCamera = videoDevices.find((device) => {
                        return /back|rear|environment/iu.test(device.label);
                    });

                    return backCamera?.deviceId || videoDevices[ videoDevices.length - 1 ]?.deviceId || '';
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

export const clearInputValue = (inputElement) => {
    if (!inputElement) {
        return;
    }

    try {
        inputElement.value = '';
    } catch (error) {
        console.error(error);
    }
};
