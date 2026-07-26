import PropTypes from 'prop-types';

import BarcodeHtml5Qrcode from '../../pages/barcode/html5-qrcode';
import BarcodeQuagga from '../../pages/barcode/quagga';
import BarcodeZXing from '../../pages/barcode/zxing';
import ToolPageShell from '../design-system/ToolPageShell';

const variants = {
    html5: BarcodeHtml5Qrcode,
    quagga: BarcodeQuagga,
    zxing: BarcodeZXing,
};

const V2Barcode = ({
    variant,
}) => {
    const Scanner = variants[ variant ];

    return (
        <ToolPageShell
            description = 'Skanna ISBN med kameran eller en bild och slå upp boken på Bokbörsen.'
            title = 'ISBN-skanner'
        >
            <Scanner />
        </ToolPageShell>
    );
};

V2Barcode.defaultProps = {
    variant: 'html5',
};

V2Barcode.propTypes = {
    variant: PropTypes.oneOf(Object.keys(variants)),
};

export default V2Barcode;
