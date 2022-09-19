import {
    // Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

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
                {Object.keys(allowedSources).map((allowedSourceKey) => {
                    return (<FormControlLabel
                        // color = 'primary'
                        control = {<Checkbox
                            checked = {allowedSources[ allowedSourceKey ]}
                            name = {allowedSourceKey}
                            onChange = {handleCheckboxChange}
                            sx = {{
                                color: '#fff',
                            }}
                        />}
                        key = {allowedSourceKey}
                        label = {sourceLabels[ allowedSourceKey ]}
                    />);
                })}
            </FormGroup>
        </Grid>
    );
};

SourcesGroup.propTypes = {
    onChange: 'func',
};

SourcesGroup.defaultProps = {
    onChange: false,
};

export default SourcesGroup;
