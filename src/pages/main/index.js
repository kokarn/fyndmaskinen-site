import {
    // useState,
    useRef,
} from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import {
    Link,
    // useParams,
    useNavigate,
} from 'react-router-dom';

const Main = () => {
    const searchRef = useRef(null);
    const navigate = useNavigate();

    return (
        <Box
            m = {2}
        >
            <form
                autoComplete = 'off'
                noValidate
                onSubmit = {(event) => {
                    event.preventDefault();
                    navigate(`/search/${searchRef.current.value}`);
                }}
            >
                <Grid
                    alignItems = 'center'
                    container
                    spacing = {2}
                >
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <TextField
                            fullWidth
                            id = 'standard-name'
                            inputProps = {{
                                type: 'search',
                            }}
                            inputRef = {searchRef}
                            label = {'Sök'}
                            margin = 'normal'
                            variant = 'standard'
                        />
                    </Grid>
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <FormGroup
                            row
                        >
                            <FormControlLabel
                                control = {<Checkbox
                                    defaultChecked
                                />}
                                disabled
                                label = {'Mindre auktionshus'}
                            />
                            {/* <FormControlLabel
                                control = {<Checkbox />}
                                disabled
                                label = 'Blocket'
                            />
                            <FormControlLabel
                                control = {<Checkbox />}
                                disabled
                                label = 'Marketplace'
                            /> */}
                            <FormControlLabel
                                control = {<Checkbox
                                    defaultChecked
                                />}
                                disabled
                                label = 'Tradera'
                            />
                            {/* <FormControlLabel
                                control = {<Checkbox />}
                                disabled
                                label = 'Auctionnet'
                            /> */}
                        </FormGroup>
                    </Grid>
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        {'Populära sökningar: '}
                        <Button
                            variant = 'text'
                        >
                            <Link
                                to = '/search/string'
                            >
                                {'string'}
                            </Link>
                        </Button>
                        <Button
                            variant = 'text'
                        >
                            <Link
                                to = '/search/lego'
                            >
                                {'lego'}
                            </Link>
                        </Button>
                        <Button
                            variant = 'text'
                        >
                            <Link
                                to = '/search/guld'
                            >
                                {'guld'}
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Main;
