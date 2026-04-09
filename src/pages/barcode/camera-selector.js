import PropTypes from 'prop-types';
import {
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import {
    useCallback,
    useState,
} from 'react';

const CameraSelector = ({
    cameras,
    onChange,
    selectedCamera,
}) => {
    const [
        anchorEl,
        setAnchorEl,
    ] = useState(null);

    const handleOpen = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSelect = useCallback((deviceId) => {
        onChange({
            target: {
                value: deviceId,
            },
        });
        setAnchorEl(null);
    }, [onChange]);

    const handleMenuItemClick = useCallback((event) => {
        handleSelect(event.currentTarget.dataset.deviceId);
    }, [ handleSelect ]);

    if (cameras.length <= 1) {
        return null;
    }

    return (
        <>
            <IconButton
                onClick = {handleOpen}
                size = 'small'
                sx = {{
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                }}
            >
                <CameraswitchIcon
                    fontSize = 'small'
                />
            </IconButton>
            <Menu
                anchorEl = {anchorEl}
                onClose = {handleClose}
                open = {Boolean(anchorEl)}
            >
                {cameras.map((camera, index) => {
                    return (
                        <MenuItem
                            data-device-id = {camera.deviceId}
                            key = {camera.deviceId}
                            onClick = {handleMenuItemClick}
                            selected = {camera.deviceId === selectedCamera}
                        >
                            {camera.label || `Kamera ${index + 1}`}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
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
