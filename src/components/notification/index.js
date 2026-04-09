import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    Alert,
    Snackbar,
} from '@mui/material';
import PropTypes from 'prop-types';

const AUTO_HIDE_MS = 6000;

const NotificationContext = createContext();

const useNotification = () => {
    return useContext(NotificationContext);
};

const NotificationProvider = ({
    children,
}) => {
    const [
        notification,
        setNotification,
    ] = useState({
        message: '',
        open: false,
        severity: 'error',
    });

    const showNotification = useCallback((message, severity = 'error') => {
        setNotification({
            message,
            open: true,
            severity,
        });
    }, []);

    useEffect(() => {
        const handleEvent = (event) => {
            showNotification(event.detail.message, event.detail.severity);
        };

        window.addEventListener('app-notification', handleEvent);

        return () => {
            window.removeEventListener('app-notification', handleEvent);
        };
    }, [ showNotification ]);

    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotification((previous) => {
            return {
                ...previous,
                open: false,
            };
        });
    }, []);

    return (
        <NotificationContext.Provider
            value = {showNotification}
        >
            {children}
            <Snackbar
                anchorOrigin = {{
                    horizontal: 'left',
                    vertical: 'bottom',
                }}
                autoHideDuration = {AUTO_HIDE_MS}
                onClose = {handleClose}
                open = {notification.open}
            >
                <Alert
                    onClose = {handleClose}
                    severity = {notification.severity}
                    variant = 'filled'
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export {
    NotificationProvider,
    useNotification,
};
