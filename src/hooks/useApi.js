import {
    useEffect,
    useState,
} from 'react';
import {
    useAuth0,
} from '@auth0/auth0-react';

export const useApi = (url, options = {}) => {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const [
        state,
        setState,
    ] = useState({
        apiData: {
            getWatches: [],
        },
        error: null,
        loading: true,
    });
    const [
        refreshIndex,
        setRefreshIndex,
    ] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const {
                    audience,
                    scope,
                    ...fetchOptions
                } = options;
                const accessToken = await getAccessTokenSilently({
                    audience,
                    scope,
                });
                const res = await fetch(url, {
                    ...fetchOptions,
                    headers: {
                        ...fetchOptions.headers,
                        // Add the Authorization header to the existing headers
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const responseData = await res.json();

                setState({
                    ...state,
                    apiData: responseData.data,
                    error: null,
                    loading: false,
                });
            } catch (error) {
                setState({
                    ...state,
                    error,
                    loading: false,
                });
            }

            return true;
        })();
    }, [refreshIndex]);

    return {
        ...state,
        refresh: () => {
            return setRefreshIndex(refreshIndex + 1);
        },
    };
};
