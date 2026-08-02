import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import SourceMark from './SourceMark';

const FilterPanel = ({
    applyLabel,
    maxPrice,
    onApply,
    onMaxPriceChange,
    onReset,
    onSortChange,
    onSourceChange,
    sort,
    sourceState,
    sources,
}) => {
    return (
        <Paper
            elevation = {0}
            sx = {{
                border: '1px solid',
                borderColor: 'border.strong',
                borderRadius: 2,
                padding: 3,
            }}
        >
            <Stack
                spacing = {2.5}
            >
                <Stack
                    alignItems = 'center'
                    direction = 'row'
                    justifyContent = 'space-between'
                >
                    <Typography
                        fontSize = '1.15rem'
                        fontWeight = {850}
                    >
                        {'Filtrera'}
                    </Typography>
                    <Button
                        onClick = {onReset}
                        size = 'small'
                        variant = 'text'
                    >
                        {'Rensa'}
                    </Button>
                </Stack>
                <Divider />
                <Stack
                    spacing = {0.25}
                >
                    <Typography
                        color = 'text.secondary'
                        fontSize = '0.75rem'
                        fontWeight = {850}
                    >
                        {'MARKNADSPLATSER'}
                    </Typography>
                    {sources.map((source) => {
                        return (
                            <FormControlLabel
                                control = {(
                                    <Checkbox
                                        checked = {Boolean(sourceState[ source.id ])}
                                        onChange = {onSourceChange}
                                        value = {source.id}
                                    />
                                )}
                                key = {source.id}
                                label = {(
                                    <SourceMark
                                        label = {source.label}
                                        sourceId = {source.id}
                                    />
                                )}
                            />
                        );
                    })}
                </Stack>
                <Divider />
                <TextField
                    fullWidth
                    inputProps = {{
                        min: 0,
                    }}
                    label = 'Maxpris'
                    onChange = {onMaxPriceChange}
                    placeholder = 'Valfritt pris'
                    type = 'number'
                    value = {maxPrice}
                />
                <FormControl
                    fullWidth
                >
                    <InputLabel
                        id = 'v2-sort-label'
                    >
                        {'Sortera'}
                    </InputLabel>
                    <Select
                        label = 'Sortera'
                        labelId = 'v2-sort-label'
                        onChange = {onSortChange}
                        value = {sort}
                    >
                        <MenuItem
                            value = 'relevance'
                        >
                            {'Mest relevant'}
                        </MenuItem>
                        <MenuItem
                            value = 'price_asc'
                        >
                            {'Lägsta pris'}
                        </MenuItem>
                        <MenuItem
                            value = 'price_desc'
                        >
                            {'Högsta pris'}
                        </MenuItem>
                    </Select>
                </FormControl>
                {onApply && (
                    <Button
                        fullWidth
                        onClick = {onApply}
                        variant = 'contained'
                    >
                        {applyLabel}
                    </Button>
                )}
            </Stack>
        </Paper>
    );
};

FilterPanel.propTypes = {
    applyLabel: PropTypes.string,
    maxPrice: PropTypes.string.isRequired,
    onApply: PropTypes.func,
    onMaxPriceChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    onSourceChange: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    sources: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    // eslint-disable-next-line react/sort-prop-types
    sourceState: PropTypes.objectOf(PropTypes.bool).isRequired,
};

FilterPanel.defaultProps = {
    applyLabel: 'Visa resultat',
    onApply: null,
};

export default FilterPanel;
