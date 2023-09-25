import PropTypes from 'prop-types';
import {
    Grid,
    Button,
    TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchField = ({
    onChange,
    onSubmit,
    searchRef,
    value,
}) => {
    return (
        <Grid
            columnSpacing = {{
                md: 2,
                sm: 2,
                xs: 1,
            }}
            container
        >
            <Grid
                item
                key = 'search-field'
                md = {10}
                xs = {8}
            >
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
            </Grid>
            <Grid
                item
                key = 'search-button'
                md = {2}
                xs = {4}
            >
                <Button
                    color = 'secondary'
                    onClick = {onSubmit}
                    sx = {{
                        alignItems: 'center',
                        display: 'flex',
                        height: 56,
                        marginTop: 2,
                        width: '100%',
                    }}
                    variant = 'contained'
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
            </Grid>
        </Grid>
    );
};

SearchField.defaultProps = {
    onChange: () => {
        // do nothing
    },
    onSubmit: () => {
        // do nothing
    },
    value: '',
};

SearchField.propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
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
