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

const PILL_RADIUS = 999;

const SearchBox = ({
    defaultValue,
    desktopAction,
    mobileAction,
    onSearch,
    rounded,
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
                    sm: desktopAction
                        ? '"input filter search"'
                        : '"input search"',
                    xs: '"input input" "action search"',
                },
                gridTemplateColumns: {
                    sm: desktopAction
                        ? 'minmax(0, 1fr) auto auto'
                        : 'minmax(0, 1fr) auto',
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
                        ...rounded && {
                            borderRadius: PILL_RADIUS,
                            paddingLeft: 1,
                        },
                    },
                    gridArea: 'input',
                }}
            />
            <Button
                color = 'primary'
                size = 'large'
                sx = {{
                    ...rounded && {
                        borderRadius: PILL_RADIUS,
                    },
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
            {desktopAction && (
                <Box
                    sx = {{
                        alignItems: 'stretch',
                        display: {
                            sm: 'flex',
                            xs: 'none',
                        },
                        gridArea: 'filter',
                        minWidth: 0,
                    }}
                >
                    {desktopAction}
                </Box>
            )}
            {mobileAction && (
                <Box
                    sx = {{
                        alignItems: 'stretch',
                        display: {
                            sm: 'none',
                            xs: 'flex',
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
    desktopAction: null,
    mobileAction: null,
    rounded: false,
};

SearchBox.propTypes = {
    defaultValue: PropTypes.string,
    desktopAction: PropTypes.node,
    mobileAction: PropTypes.node,
    onSearch: PropTypes.func.isRequired,
    rounded: PropTypes.bool,
};

export default SearchBox;
