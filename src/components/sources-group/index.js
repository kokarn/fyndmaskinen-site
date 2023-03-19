import {
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

import sources from '../../sources';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';

const SourcesGroup = (props) => {
    const [
        allowedSources,
        setAllowedSources,
    ] = useStateWithLocalStorage(
        'sources',
        Object.fromEntries(sources
            .map((source) => {
                return [
                    source.id,
                    source.defaultEnabled,
                ];
            }))
    );

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
                justifyContent: 'center',
                gap: '10px',
            }}
            xs = {12}
        >
            {sources.map((source) => {
                return (
                    <Chip
                    style={{
                        backgroundColor: '#FFFFFF',
                        marginTop: 30,
                        paddingRight: 5,
                        borderRadius: 8,
                        color:'#000000DE'
                        
                    }}
                        deleteIcon = {allowedSources[ source.id ] ?
                            <DoneIcon sx={{color: "#FFFFFF", backgroundColor: '#39B4BF', borderRadius: 1,  }}/> :
                            <ClearIcon sx={{ color: "white",backgroundColor: '#39B4BF',borderRadius: 1, }}/>
                        }
                        icon = {source.icon}
                        key = {source.id}
                        label = {source.label}
                        onClick = {() => {
                            handleChipClick(source.id);
                        }}
                        onDelete = {() => {
                            handleChipClick(source.id);
                        }}
                        variant = {allowedSources[ source.id ] ?
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
