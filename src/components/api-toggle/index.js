import Chip from '@mui/material/Chip';

const PROD_API = 'https://api.fyndmaskinen.se';

const ApiToggle = () => {
    if (!window.location.origin.includes('localhost')) {
        return null;
    }

    const isProd = window.API_HOSTNAME === PROD_API;

    const handleToggle = () => {
        localStorage.setItem('apiToggle', isProd
            ? 'dev'
            : 'prod');
        window.location.reload();
    };

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
