import {
    Link,
} from 'react-router-dom';
import {
    IconButton,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const WatchListItem = ({
    onDelete,
    watchString,
}) => {
    return (
        <div
            style = {{
                // backgroundColor: 'rgba(0, 0, 0, 0.6)',
                // color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <Link
                to = {`/search/${watchString}`}
            >
                <Typography
                    variant = 'h6'
                >
                    {watchString}
                </Typography>
            </Link>
            <IconButton
                aria-label = 'delete'
                onClick = {onDelete}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    );
};

WatchListItem.propTypes = {
    onDelete: PropTypes.func.isRequired,
    watchString: PropTypes.string.isRequired,
};

export default WatchListItem;
