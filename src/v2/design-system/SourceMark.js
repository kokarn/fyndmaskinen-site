import PropTypes from 'prop-types';
import {
    Avatar,
    Chip,
} from '@mui/material';

const sourceColors = {
    auction2000: '#8B6330',
    auctionet: '#2E8A6C',
    blocket: '#3568D4',
    bukowskis: '#765082',
    tradera: '#F05A3C',
    'uppsala-auktionskammare': '#8B6330',
};

const SourceMark = ({
    compact,
    label,
    sourceId,
}) => {
    const color = sourceColors[ sourceId ] || '#58716B';

    return (
        <Chip
            avatar = {compact
                ? null
                : (
                    <Avatar
                        sx = {{
                            '&.MuiAvatar-root': {
                                backgroundColor: `${color}18`,
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
                    : '#FFFFFF',
                color: compact
                    ? '#FFFFFF'
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
