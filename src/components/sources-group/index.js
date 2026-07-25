/* eslint-disable react/no-multi-comp */
import {
    useCallback,
} from 'react';
import {
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

import sources from '../../sources';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage';
import getSourceChipStyle from './source-chip-style';

const SourceChipItem = ({
    icon,
    isActive,
    label,
    onToggle,
    sourceId,
}) => {
    const handleToggle = useCallback(() => {
        onToggle(sourceId);
    }, [
        onToggle,
        sourceId,
    ]);

    return (
        <Chip
            deleteIcon = {isActive ?
                <DoneIcon
                    sx = {{
                        color: '#fff',
                        fill: '#39b4bf',
                    }}
                /> :
                <ClearIcon
                    sx = {{
                        color: '#fff',
                        fill: '#ccc',
                    }}
                />
            }
            icon = {icon}
            label = {label}
            onClick = {handleToggle}
            onDelete = {handleToggle}
            // eslint-disable-next-line react/forbid-component-props
            style = {getSourceChipStyle(isActive)}
        />
    );
};

SourceChipItem.propTypes = {
    icon: PropTypes.node.isRequired,
    isActive: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    sourceId: PropTypes.string.isRequired,
};

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
            })),
    );

    const handleChipClick = useCallback((sourceClicked) => {
        setAllowedSources((previous) => {
            const newSources = {
                ...previous,
                [ sourceClicked ]: !previous[ sourceClicked ],
            };

            if (props.onChange) {
                props.onChange(newSources);
            }

            return newSources;
        });
    }, [
        props,
        setAllowedSources,
    ]);

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
            {sources.map((source) => {
                return (
                    <SourceChipItem
                        icon = {source.icon}
                        isActive = {Boolean(allowedSources[ source.id ])}
                        key = {source.id}
                        label = {source.label}
                        onToggle = {handleChipClick}
                        sourceId = {source.id}
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
    onChange: () => { },
};

export default SourcesGroup;
