import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from '@mui/material';
import {
    Link,
} from 'react-router-dom';

const WatchGroupCard = ({
    label,
    watches,
}) => {
    return (
        <Card
            variant = 'outlined'
        >
            <CardContent>
                <Stack
                    spacing = {1.5}
                >
                    <Stack
                        alignItems = 'baseline'
                        direction = {{
                            sm: 'row',
                            xs: 'column',
                        }}
                        justifyContent = 'space-between'
                    >
                        <Typography
                            sx = {{
                                fontWeight: 800,
                            }}
                        >
                            {label}
                        </Typography>
                        <Typography
                            color = 'text.secondary'
                        >
                            {`${watches.length} bevakningar`}
                        </Typography>
                    </Stack>
                    <Stack
                        direction = 'row'
                        flexWrap = 'wrap'
                        gap = {1}
                    >
                        {watches.map((match) => {
                            return (
                                <Chip
                                    clickable
                                    component = {Link}
                                    key = {match}
                                    label = {match}
                                    to = {`/search/${encodeURIComponent(match)}`}
                                    variant = 'outlined'
                                />
                            );
                        })}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

WatchGroupCard.propTypes = {
    label: PropTypes.string.isRequired,
    watches: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default WatchGroupCard;
