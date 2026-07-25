import {
    useCallback,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import {
    Button,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';

const SearchBox = ({
    defaultValue,
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
        <Stack
            component = 'form'
            direction = {{
                sm: 'row',
                xs: 'column',
            }}
            onSubmit = {handleSubmit}
            spacing = {1.5}
            sx = {{
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
                }}
            />
            <Button
                color = 'primary'
                size = 'large'
                sx = {{
                    flexShrink: 0,
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
                {'Sök alla'}
            </Button>
        </Stack>
    );
};

SearchBox.defaultProps = {
    defaultValue: '',
};

SearchBox.propTypes = {
    defaultValue: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
};

export default SearchBox;
