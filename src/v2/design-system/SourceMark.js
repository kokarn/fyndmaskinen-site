import PropTypes from 'prop-types';
import {
    Avatar,
    Chip,
} from '@mui/material';
import {
    alpha,
} from '@mui/material/styles';

import {
    sourceColors,
} from './theme';

const SourceMark = ({
    compact,
    label,
    sourceId,
}) => {
    const color = sourceColors[ sourceId ] || sourceColors.fallback;

    return (
        <Chip
            avatar = {compact
                ? null
                : (
                    <Avatar
                        sx = {{
                            '&.MuiAvatar-root': {
                                backgroundColor: alpha(color, 0.1),
                                color: color,
                                fontWeight: 900,
                            },
                        }}
                    >
                        {label.charAt(0)}
                    </Avatar>
                )}
            label = {label}
            size = 'small'
            sx = {{
                backgroundColor: compact
                    ? color
                    : 'background.paper',
                color: compact
                    ? 'primary.contrastText'
                    : 'text.primary',
                fontWeight: 750,
            }}
        />
    );
};

SourceMark.defaultProps = {
    compact: false,
};

SourceMark.propTypes = {
    compact: PropTypes.bool,
    label: PropTypes.string.isRequired,
    sourceId: PropTypes.string.isRequired,
};

export default SourceMark;
