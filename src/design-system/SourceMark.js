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

const SOURCE_TINT_OPACITY = 0.1;
const sourceIconPaths = {
    blocket: '/images/icons/blocket.png',
    bukowskis: '/images/icons/bukowskis.png',
    tradera: '/images/icons/tradera-40x40.png',
    'uppsala-auktionskammare': '/images/icons/uppsala-auktionskammare.png',
};
const sourceInitials = {
    auction2000: 'A',
    auctionet: 'A',
};

const SourceMark = ({
    compact,
    label,
    sourceId,
}) => {
    const color = sourceColors[ sourceId ] || sourceColors.fallback;
    const iconPath = sourceIconPaths[ sourceId ];

    const avatar = iconPath
        ? (
            <Avatar
                alt = ''
                src = {iconPath}
                sx = {{
                    '&.MuiAvatar-root': {
                        backgroundColor: 'background.paper',
                        objectFit: 'contain',
                    },
                }}
            />
        )
        : (
            <Avatar
                sx = {{
                    '&.MuiAvatar-root': {
                        backgroundColor: alpha(color, SOURCE_TINT_OPACITY),
                        color: color,
                        fontWeight: 900,
                    },
                }}
            >
                {sourceInitials[ sourceId ] || '•'}
            </Avatar>
        );

    return (
        <Chip
            avatar = {compact && !iconPath
                ? null
                : avatar}
            label = {label}
            size = 'small'
            sx = {{
                backgroundColor: alpha(color, SOURCE_TINT_OPACITY),
                border: '1px solid',
                borderColor: color,
                color: color,
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
