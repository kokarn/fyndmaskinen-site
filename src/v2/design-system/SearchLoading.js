import {
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';

const SearchLoading = () => {
    return (
        <Stack
            alignItems = 'center'
            aria-live = 'polite'
            padding = {{
                sm: 8,
                xs: 5,
            }}
            role = 'status'
            spacing = {2}
        >
            <CircularProgress
                size = {36}
            />
            <Typography
                color = 'text.secondary'
                fontWeight = {750}
            >
                {'Söker efter fynd…'}
            </Typography>
        </Stack>
    );
};

export default SearchLoading;
