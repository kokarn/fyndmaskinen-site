import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
} from '@mui/material';

const StatisticCard = ({
    label,
    mark,
    value,
}) => {
    return (
        <Card
            variant = 'outlined'
        >
            <CardContent>
                <Stack
                    alignItems = 'center'
                    direction = 'row'
                    spacing = {1.5}
                >
                    {mark}
                    <Box>
                        <Typography
                            color = 'text.secondary'
                            variant = 'caption'
                        >
                            {label}
                        </Typography>
                        <Typography
                            sx = {{
                                fontWeight: 800,
                            }}
                            variant = 'body1'
                        >
                            {value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

StatisticCard.defaultProps = {
    mark: null,
};

StatisticCard.propTypes = {
    label: PropTypes.string.isRequired,
    mark: PropTypes.node,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};

export default StatisticCard;
