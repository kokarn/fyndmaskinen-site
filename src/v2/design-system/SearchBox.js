import {
    useCallback,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    InputAdornment,
    TextField,
} from '@mui/material';

const SearchBox = ({
    defaultValue,
    mobileAction,
    onSearch,
}) => {
    const inputRef = useRef(null);
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const value = inputRef.current.value.trim();

        if (value) {
            onSearch(value);
        }
    }, [ onSearch ]);

    return (
        <Box
            component = 'form'
            onSubmit = {handleSubmit}
            sx = {{
                display: 'grid',
                gap: 1.5,
                gridTemplateAreas: {
                    sm: '"input search"',
                    xs: '"input input" "search action"',
                },
                gridTemplateColumns: {
                    sm: 'minmax(0, 1fr) auto',
                    xs: 'minmax(0, 1fr) minmax(0, 1fr)',
                },
                width: '100%',
            }}
        >
            <TextField
                autoFocus
                defaultValue = {defaultValue}
                fullWidth
                inputRef = {inputRef}
                placeholder = 'Vad letar du efter?'
                slotProps = {{
                    input: {
                        startAdornment: (
                            <InputAdornment
                                position = 'start'
                            >
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
                sx = {{
                    '& .MuiOutlinedInput-root': {
                        minHeight: {
                            sm: 64,
                            xs: 54,
                        },
                    },
                    gridArea: 'input',
                }}
            />
            <Button
                color = 'primary'
                size = 'large'
                sx = {{
                    flexShrink: 0,
                    gridArea: 'search',
                    minHeight: {
                        xs: 52,
                    },
                    minWidth: {
                        sm: 190,
                    },
                }}
                type = 'submit'
                variant = 'contained'
            >
                {'Sök'}
            </Button>
            {mobileAction && (
                <Box
                    sx = {{
                        display: {
                            sm: 'none',
                            xs: 'block',
                        },
                        gridArea: 'action',
                        minWidth: 0,
                    }}
                >
                    {mobileAction}
                </Box>
            )}
        </Box>
    );
};

SearchBox.defaultProps = {
    defaultValue: '',
    mobileAction: null,
};

SearchBox.propTypes = {
    defaultValue: PropTypes.string,
    mobileAction: PropTypes.node,
    onSearch: PropTypes.func.isRequired,
};

export default SearchBox;
