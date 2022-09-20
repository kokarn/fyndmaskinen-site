import {
    // Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';

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
    'auctionet',
    'blocket',
    'auction2000',
    'tradera',
];

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

    return (
        <Grid
            md = {12}
            xs = {12}
        >
            <FormGroup
                row
            >
                {sourceOrder.map((sourceKey) => {
                    return (<FormControlLabel
                        // color = 'primary'
                        control = {<Checkbox
                            checked = {allowedSources[ sourceKey ]}
                            name = {sourceKey}
                            onChange = {handleCheckboxChange}
                            sx = {{
                                color: '#fff',
                            }}
                        />}
                        key = {sourceKey}
                        label = {sourceLabels[ sourceKey ]}
                    />);
                })}
            </FormGroup>
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
