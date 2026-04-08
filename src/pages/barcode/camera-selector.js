import PropTypes from 'prop-types';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';

const CameraSelector = ({
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


export default CameraSelector;
