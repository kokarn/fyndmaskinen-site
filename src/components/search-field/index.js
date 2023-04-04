import PropTypes from 'prop-types';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const SearchField = ({
    onChange,
    searchRef,
    value,
}) => {
    return (
        <Box>
            <TextField
                autoFocus
                defaultValue = {value}
                fullWidth
                id = 'outlined-basic'
                inputProps = {{
                    tabIndex: 0,
                    type: 'search',
                }}
                InputProps = {{
                    endAdornment: (
                        <InputAdornment
                            position = 'end'
                        >
                            <Button
                                sx = {{
                                    alignItems: 'center',
                                    backgroundColor: '#F4C50A',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    height: 45,
                                    padding: '0 40px',
                                }}
                                variant = ''
                            >
                                <SearchIcon />
                                <h2
                                    style = {{
                                        marginLeft: 5,
                                    }}
                                >
                                    {'SÖK'}
                                </h2>

                            </Button>
                        </InputAdornment>),
                    sx: {
                        padding: '0px 6px',
                    },
                }}
                inputRef = {searchRef}
                margin = 'normal'
                onChange = {onChange}
                placeholder = {'Lamino'}
                // tabIndex = {0}
                sx = {{
                    backgroundColor: '#FFFFFF',
                    paddingRight: 0,
                }}
                variant = 'outlined'
            />
        </Box>
    );
};

SearchField.defaultProps = {
    onChange: () => {
        // do nothing
    },
    value: '',
};

SearchField.propTypes = {
    onChange: PropTypes.func,
    searchRef: PropTypes.oneOfType([
        // Either a function
        PropTypes.func,
        // Or the instance of a DOM native element (see the note about SSR)
        PropTypes.shape({
            current: PropTypes.instanceOf(Element),
        }),
    ]).isRequired,
    value: PropTypes.string,
};

export default SearchField;
