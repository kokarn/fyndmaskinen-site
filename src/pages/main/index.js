import {
    // useState,
    useRef,
} from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
} from '@mui/material';
import {
    Link,
    // useParams,
    useNavigate,
} from 'react-router-dom';

import SourcesGroup from '../../components/sources-group';

const Main = () => {
    const searchRef = useRef(null);
    const navigate = useNavigate();

    return (
        <Box
            m = {30}
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
                    spacing = {4}
                    sx = {{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
                >
                    <Grid
                        item
                        md = {12}
                        xs = {12}
                    >
                        <TextField
                            autoFocus
                            fullWidth
                            id = 'standard-name'
                            inputProps = {{
                                tabIndex: 0,
                                type: 'search',
                            }}
                            inputRef = {searchRef}
                            label = {'Sök'}
                            margin = 'normal'
                            // tabIndex = {0}
                            variant = 'standard'
                        />
                    </Grid>
                    <SourcesGroup />
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
