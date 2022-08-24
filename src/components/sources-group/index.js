import {
    Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';

const sourceLabels = {
    auction2000: 'Mindre auktionshus',
    tradera: 'Tradera',
};

const SourcesGroup = () => {
    const [
        allowedSources,
        setAllowedSources,
    ] = useStateWithLocalStorage(
        'sources',
        {
            auction2000: true,
            tradera: true,
        },
    );

    const handleCheckboxChange = (event) => {
        setAllowedSources({
            ...allowedSources,
            [ event.target.name ]: event.target.checked,
        });
    };

    return (
        <Grid
            item
            md = {12}
            xs = {12}
        >
            <FormGroup
                row
            >
                {Object.keys(allowedSources).map((allowedSourceKey) => {
                    return (<FormControlLabel
                        control = {<Checkbox
                            checked = {allowedSources[ allowedSourceKey ]}
                            name = {allowedSourceKey}
                            onChange = {handleCheckboxChange}
                        />}
                        key = {allowedSourceKey}
                        label = {sourceLabels[ allowedSourceKey ]}
                    />);
                })}
            </FormGroup>
        </Grid>
    );
};

export default SourcesGroup;
