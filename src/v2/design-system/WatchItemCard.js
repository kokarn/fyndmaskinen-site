import PropTypes from 'prop-types';
import {
    useCallback,
} from 'react';
import {
    Button,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Link,
} from 'react-router-dom';

const WatchItemCard = ({
    match,
    onDelete,
}) => {
    const handleDelete = useCallback((event) => {
        onDelete(event.currentTarget.dataset.match);
    }, [ onDelete ]);

    return (
        <Card
            variant = 'outlined'
        >
            <CardContent
                sx = {{
                    '&:last-child': {
                        paddingBottom: 2,
                    },
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 2,
                }}
            >
                <Typography
                    component = {Link}
                    sx = {{
                        color: 'text.primary',
                        fontWeight: 800,
                        textDecoration: 'none',
                    }}
                    to = {`/v2/search/${encodeURIComponent(match)}`}
                >
                    {match}
                </Typography>
                {onDelete && (
                    <Button
                        aria-label = {`Ta bort bevakningen ${match}`}
                        color = 'secondary'
                        data-match = {match}
                        onClick = {handleDelete}
                        startIcon = {<DeleteOutlineIcon />}
                        variant = 'text'
                    >
                        {'Ta bort'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

WatchItemCard.defaultProps = {
    onDelete: null,
};

WatchItemCard.propTypes = {
    match: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
};

export default WatchItemCard;
