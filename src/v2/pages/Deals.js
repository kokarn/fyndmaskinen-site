import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Alert,
    CircularProgress,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';

import DealTable from '../design-system/DealTable';
import ToolPageShell from '../design-system/ToolPageShell';

const V2Deals = () => {
    const [
        deals, setDeals,
    ] = useState({});
    const [
        error, setError,
    ] = useState('');
    const [
        isLoading, setIsLoading,
    ] = useState(true);
    const [
        selectedTab, setSelectedTab,
    ] = useState('');

    useEffect(() => {
        fetch(`${window.API_HOSTNAME}/deals`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Kunde inte hämta fynd (${response.status})`);
                }

                return response.json();
            })
            .then((response) => {
                const nextDeals = response?.data || {};
                const firstIdentifier = Object.keys(nextDeals)[ 0 ] || '';

                setDeals(nextDeals);
                setSelectedTab(firstIdentifier);
            })
            .catch((fetchError) => {
                setError(fetchError.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const identifiers = useMemo(() => {
        return Object.keys(deals);
    }, [ deals ]);
    const handleTabChange = useCallback((event, value) => {
        setSelectedTab(value);
    }, []);
    const selectedDeals = deals[ selectedTab ];

    return (
        <ToolPageShell
            description = 'Jämför värderingar med aktuella bud och hitta möjliga auktionsfynd.'
            title = 'Fyndmatchning'
        >
            <Stack
                spacing = {4}
            >
                {isLoading && (
                    <Stack
                        alignItems = 'center'
                        direction = 'row'
                        role = 'status'
                        spacing = {1.5}
                    >
                        <CircularProgress
                            size = {24}
                        />
                        <Typography>{'Hämtar fynd…'}</Typography>
                    </Stack>
                )}
                {error && (
                    <Alert
                        severity = 'error'
                    >
                        {error}
                    </Alert>
                )}
                {!isLoading && !error && identifiers.length === 0 && (
                    <Alert
                        severity = 'info'
                    >
                        {'Inga fynddata finns tillgängliga just nu.'}
                    </Alert>
                )}
                {identifiers.length > 0 && (
                    <Tabs
                        onChange = {handleTabChange}
                        scrollButtons = 'auto'
                        value = {selectedTab}
                        variant = 'scrollable'
                    >
                        {identifiers.map((identifier) => {
                            const group = deals[ identifier ];

                            return (
                                <Tab
                                    key = {identifier}
                                    label = {`${identifier} · ${group.matching.length}/${group.missing.length}`}
                                    value = {identifier}
                                />
                            );
                        })}
                    </Tabs>
                )}
                {selectedDeals && (
                    <Stack
                        spacing = {5}
                    >
                        <DealTable
                            items = {selectedDeals.matching || []}
                            type = 'matching'
                        />
                        <DealTable
                            items = {selectedDeals.missing || []}
                            type = 'missing'
                        />
                    </Stack>
                )}
            </Stack>
        </ToolPageShell>
    );
};

export default V2Deals;
