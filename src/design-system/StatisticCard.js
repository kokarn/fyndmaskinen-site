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
            sx = {{
                height: '100%',
                width: '100%',
            }}
            variant = 'outlined'
        >
            <CardContent>
                <Stack
                    alignItems = 'center'
                    direction = 'row'
                    spacing = {1.5}
                    sx = {{
                        minWidth: 0,
                        width: '100%',
                    }}
                >
                    {mark}
                    <Box
                        sx = {{
                            marginLeft: 'auto',
                            minWidth: 0,
                            textAlign: {
                                sm: 'left',
                                xs: 'right',
                            },
                        }}
                    >
                        {!mark && (
                            <Typography
                                color = 'text.secondary'
                                noWrap
                                variant = 'caption'
                            >
                                {label}
                            </Typography>
                        )}
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
