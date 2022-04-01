import {
    // useState,
    useRef,
} from 'react';
import {
    Box,
    Grid,
    // Typography,
    TextField,
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
        <div
            className = 'App'
        >
            <Box
                m = {2}
            >
                <Grid
                    container
                    spacing = {2}
                    // alignItems = { 'flex-end' }
                >
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <form
                            autoComplete = 'off'
                            noValidate
                            onSubmit = {(event) => {
                                event.preventDefault();
                                navigate(`/search/${searchRef.current.value}`);
                            }}
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
                            {/* <FormGroup>
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Auctions"
                            />
                            <FormControlLabel
                                disabled
                                control={<Checkbox />}
                                label="Blocket"
                            />
                            <FormControlLabel
                                disabled
                                control={<Checkbox />}
                                label="Marketplace"
                            />
                        </FormGroup> */}
                        </form>
                        <div>
                            {'Populära sökningar: '}
                            <Link
                                to = '/search/string'
                            >
                                {'string'}
                            </Link>
                            {' '}
                            <Link
                                to = '/search/lego'
                            >
                                {'lego'}
                            </Link>
                            {' '}
                            <Link
                                to = '/search/guld'
                            >
                                {'guld'}
                            </Link>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Main;
