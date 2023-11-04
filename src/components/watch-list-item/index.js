import {
    Link,
} from 'react-router-dom';
import {
    Box,
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
        <Box
            sx = {{
                '&:hover a': {
                    textUnderlineOffset: '4px',
                },
                a: {
                    textUnderlineOffset: '2px',
                    transition: 'all 0.1s ease-in-out',
                },
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <Link
                // eslint-disable-next-line react/forbid-component-props
                style = {{
                    color: '#fff',
                    textShadow: '0 0 4px black',
                }}
                to = {`/search/${watchString}`}
            >
                <Typography
                    sx = {{
                        color: '#fff',
                        textShadow: '0 0 4px black',
                    }}
                    variant = 'h6'
                >
                    {watchString}
                </Typography>
            </Link>
            {
                (onDelete) ?
                    <IconButton
                        aria-label = 'delete'
                        onClick = {onDelete}
                    >
                        <DeleteIcon />
                    </IconButton>
                    :
                    ''
            }
        </Box>
    );
};

WatchListItem.propTypes = {
    onDelete: PropTypes.func.isRequired,
    watchString: PropTypes.string.isRequired,
};

export default WatchListItem;
