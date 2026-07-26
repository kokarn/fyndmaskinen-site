import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Stack,
    Typography,
} from '@mui/material';
import {
    Link,
} from 'react-router-dom';

const FeatureLinkCard = ({
    description,
    icon: Icon,
    label,
    to,
}) => {
    return (
        <Card
            sx = {{
                height: '100%',
            }}
        >
            <CardActionArea
                component = {Link}
                sx = {{
                    height: '100%',
                }}
                to = {to}
            >
                <CardContent>
                    <Stack
                        alignItems = 'flex-start'
                        spacing = {2}
                    >
                        <Icon
                            color = 'primary'
                            sx = {{
                                fontSize: 36,
                            }}
                        />
                        <Box>
                            <Typography
                                variant = 'h6'
                            >
                                {label}
                            </Typography>
                            <Typography
                                color = 'text.secondary'
                                variant = 'body2'
                            >
                                {description}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

FeatureLinkCard.propTypes = {
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default FeatureLinkCard;
