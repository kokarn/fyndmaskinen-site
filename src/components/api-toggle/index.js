import {
    useCallback,
} from 'react';
import Chip from '@mui/material/Chip';

const PROD_API = 'https://api.fyndmaskinen.se';

const ApiToggle = () => {
    const handleToggle = useCallback(() => {
        const currentIsProd = window.API_HOSTNAME === PROD_API;

        localStorage.setItem('apiToggle', currentIsProd
            ? 'dev'
            : 'prod');
        window.location.reload();
    }, []);

    if (!window.location.origin.includes('localhost')) {
        return null;
    }

    const isProd = window.API_HOSTNAME === PROD_API;

    return (
        <Chip
            color = {isProd
                ? 'error'
                : 'success'}
            label = {isProd
                ? 'PROD API'
                : 'DEV API'}
            onClick = {handleToggle}
            size = 'small'
            sx = {{
                bottom: 16,
                cursor: 'pointer',
                fontWeight: 700,
                left: 16,
                opacity: 0.85,
                position: 'fixed',
                zIndex: 9999,
            }}
        />
    );
};

export default ApiToggle;
