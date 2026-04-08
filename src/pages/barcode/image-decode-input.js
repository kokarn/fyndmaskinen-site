import PropTypes from 'prop-types';
import {
    Button,
} from '@mui/material';

const ImageDecodeInput = ({
    onChange,
}) => {
    return (
        <Button
            color = 'secondary'
            component = 'label'
            variant = 'outlined'
        >
            {'Välj'}
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


export default ImageDecodeInput;
