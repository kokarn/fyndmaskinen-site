import {
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

import Auction2000Icon from '../auction2000-icon';
import AuctionetIcon from '../auctionet-icon';
import BlocketIcon from '../blocket-icon';
import TraderIcon from '../tradera-icon';

import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';

const sourceLabels = {
    auction2000: 'Mindre auktionshus',
    auctionet: 'Auctionet',
    blocket: 'Blocket',
    tradera: 'Tradera',
};

const defaultSources = {
    auction2000: true,
    auctionet: true,
    blocket: true,
    tradera: true,
};

const sourceOrder = [
    'auction2000',
    'auctionet',
    'blocket',
    'tradera',
];

const iconMap = {
    auction2000: <Auction2000Icon />,
    auctionet: <AuctionetIcon />,
    blocket: <BlocketIcon />,
    tradera: <TraderIcon />,
};

const SourcesGroup = (props) => {
    const [
        allowedSources,
        setAllowedSources,
    ] = useStateWithLocalStorage(
        'sources',
        defaultSources,
    );

    for (const source in defaultSources) {
        if (typeof allowedSources[ source ] === 'undefined') {
            allowedSources[ source ] = defaultSources[ source ];
        }
    }

    const handleCheckboxChange = (event) => {
        const newSources = {
            ...allowedSources,
            [ event.target.name ]: event.target.checked,
        };

        setAllowedSources(newSources);

        if (props.onChange) {
            props.onChange(newSources);
        }
    };

    const handleChipClick = (sourceClicked) => {
        const newSources = {
            ...allowedSources,
            [ sourceClicked ]: !allowedSources[ sourceClicked ],
        };

        setAllowedSources(newSources);

        if (props.onChange) {
            props.onChange(newSources);
        }
    };

    return (
        <Grid
            md = {12}
            spacing = {2}
            sx = {{
                display: 'flex',
                flexFlow: 'wrap',
                gap: '10px',
            }}
            xs = {12}
        >
            {sourceOrder.map((sourceKey) => {
                return (
                    <Chip
                        deleteIcon = {allowedSources[ sourceKey ] ?
                            <DoneIcon /> :
                            <ClearIcon />
                        }
                        icon = {iconMap[ sourceKey ]}
                        key = {sourceKey}
                        label = {sourceLabels[ sourceKey ]}
                        onClick = {() => {
                            handleChipClick(sourceKey);
                        }}
                        onDelete = {() => {
                            handleChipClick(sourceKey);
                        }}
                        variant = {allowedSources[ sourceKey ] ?
                            'default' :
                            'outlined'
                        }
                    />
                );
            })}
        </Grid>
    );
};

SourcesGroup.propTypes = {
    onChange: PropTypes.func,
};

SourcesGroup.defaultProps = {
    // eslint-disable-next-line no-empty-function
    onChange: () => {},
};

export default SourcesGroup;
