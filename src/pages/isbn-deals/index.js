import {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
} from 'react';
import {
    useQuery,
} from 'react-query';
import PropTypes from 'prop-types';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import doSearch from '../../features/search';
import {
    normalizeBokborsenResults,
} from '../barcode/shared';

const IMAGE_PROXY = 'https://wsrv.nl';

const allSources = 'tradera,blocket,auctionet,bukowskis,auction2000,uppsala-auktionskammare';

const LOOKUP_DELAY_MS = 600;
const STALE_TIME_BOKBORSEN = 600000;
const STALE_TIME_SEARCH = 300000;

const formatPrice = (price) => {
    if (!price && price !== 0) {
        return '–';
    }

    return new Intl.NumberFormat('sv-SE', {
        currency: 'SEK',
        minimumFractionDigits: 0,
        style: 'currency',
    }).format(price);
};

const parseIsbn = (text) => {
    if (!text) {
        return null;
    }

    const cleaned = text.replace(/(?<digit1>\d)[-\s]+(?<digit2>\d)/gu, '$1$2');

    const isbn13Match = cleaned.match(/\b(?<isbn13>97[89]\d{10})\b/u);

    if (isbn13Match) {
        return isbn13Match[ 1 ];
    }

    const isbn10Match = cleaned.match(/\b(?<isbn10>\d{9}[\dXx])\b/u);

    if (isbn10Match) {
        return isbn10Match[ 1 ];
    }

    return null;
};

const getBokborsenPrices = (data) => {
    if (!data || data.length === 0) {
        return null;
    }

    const prices = data
        .map((book) => {
            return Number(book.price) || 0;
        })
        .filter((price) => {
            return price > 0;
        });

    if (prices.length === 0) {
        return null;
    }

    const highPrices = data
        .map((book) => {
            return Number(book.priceHigh || book.price) || 0;
        })
        .filter((price) => {
            return price > 0;
        });

    return {
        high: Math.max(...highPrices.length > 0
            ? highPrices
            : prices),
        low: Math.min(...prices),
    };
};

const BokborsenCell = ({
    isbn,
    onResult,
    shouldLookup,
}) => {
    const [
        enabled,
        setEnabled,
    ] = useState(false);

    useEffect(() => {
        if (shouldLookup) {
            setEnabled(true);
        }
    }, [ shouldLookup ]);

    const {
        data,
        isError,
        isFetching,
    } = useQuery([
        'bokborsen',
        isbn,
    ], async ({
        queryKey,
    }) => {
        const response = await fetch(`${window.API_HOSTNAME}/bokborsen/${encodeURIComponent(queryKey[ 1 ])}`);

        if (!response.ok) {
            throw new Error(`Bokbörsen-fel (${response.status})`);
        }

        const payload = await response.json();

        return normalizeBokborsenResults(payload);
    }, {
        enabled: enabled && Boolean(isbn),
        placeholderData: [],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME_BOKBORSEN,
    });

    useEffect(() => {
        if (!isFetching && enabled && data) {
            onResult(isbn, data);
        }
    }, [
        data,
        enabled,
        isbn,
        isFetching,
        onResult,
    ]);

    const handleLookup = useCallback(() => {
        setEnabled(true);
    }, []);

    if (!isbn) {
        return (
            <TableCell
                align = 'right'
            >
                {'–'}
            </TableCell>
        );
    }

    if (!enabled) {
        return (
            <TableCell
                align = 'right'
            >
                <Tooltip
                    title = 'Sök pris på Bokbörsen'
                >
                    <IconButton
                        color = 'primary'
                        onClick = {handleLookup}
                        size = 'small'
                    >
                        <SearchIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        );
    }

    if (isFetching) {
        return (
            <TableCell
                align = 'right'
            >
                <CircularProgress
                    size = {20}
                />
            </TableCell>
        );
    }

    if (isError) {
        return (
            <TableCell
                align = 'right'
            >
                <Typography
                    color = 'error'
                    variant = 'body2'
                >
                    {'Fel'}
                </Typography>
            </TableCell>
        );
    }

    if (!data || data.length === 0) {
        return (
            <TableCell
                align = 'right'
            >
                <Typography
                    color = 'text.secondary'
                    variant = 'body2'
                >
                    {'Ej hittad'}
                </Typography>
            </TableCell>
        );
    }

    const prices = getBokborsenPrices(data);

    if (!prices) {
        return (
            <TableCell
                align = 'right'
            >
                <Typography
                    color = 'text.secondary'
                    variant = 'body2'
                >
                    {'Inga priser'}
                </Typography>
            </TableCell>
        );
    }

    return (
        <TableCell
            align = 'right'
        >
            <Tooltip
                title = {data.map((book) => {
                    return book.title;
                }).join(', ')}
            >
                <Typography
                    variant = 'body2'
                >
                    {prices.low === prices.high
                        ? formatPrice(prices.low)
                        : `${formatPrice(prices.low)} – ${formatPrice(prices.high)}`}
                </Typography>
            </Tooltip>
        </TableCell>
    );
};

BokborsenCell.defaultProps = {
    shouldLookup: false,
};

BokborsenCell.propTypes = {
    isbn: PropTypes.string.isRequired,
    onResult: PropTypes.func.isRequired,
    shouldLookup: PropTypes.bool,
};

const IsbnDeals = () => {
    const [
        lookupIsbns,
        setLookupIsbns,
    ] = useState({});
    const [
        bokborsenPrices,
        setBokborsenPrices,
    ] = useState({});
    const [
        sortBy,
        setSortBy,
    ] = useState('default');
    const [
        sortDirection,
        setSortDirection,
    ] = useState('desc');
    const [
        isLookingUpAll,
        setIsLookingUpAll,
    ] = useState(false);
    const lookupTimerRef = useRef(null);

    const {
        data: searchResults,
        isFetching: isSearching,
        isError: isSearchError,
    } = useQuery([
        'isbn-search',
        'ISBN',
        allSources,
    ], doSearch, {
        placeholderData: [],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: STALE_TIME_SEARCH,
    });

    const itemsWithIsbn = useMemo(() => {
        if (!searchResults || !Array.isArray(searchResults)) {
            return [];
        }

        return searchResults
            .map((item) => {
                return {
                    ...item,
                    isbn: parseIsbn(item.title),
                };
            })
            .filter((item) => {
                return item.isbn;
            });
    }, [ searchResults ]);

    const handleBokborsenResult = useCallback((isbn, data) => {
        const prices = getBokborsenPrices(data);

        setBokborsenPrices((previous) => {
            return {
                ...previous,
                [ isbn ]: prices,
            };
        });
    }, []);

    const handleLookupAll = useCallback(() => {
        setIsLookingUpAll(true);
        let index = 0;

        const scheduleNext = () => {
            if (index >= itemsWithIsbn.length) {
                setIsLookingUpAll(false);

                return;
            }

            const isbn = itemsWithIsbn[ index ].isbn;

            setLookupIsbns((previous) => {
                return {
                    ...previous,
                    [ isbn ]: true,
                };
            });

            index = index + 1;
            lookupTimerRef.current = setTimeout(scheduleNext, LOOKUP_DELAY_MS);
        };

        scheduleNext();
    }, [ itemsWithIsbn ]);

    useEffect(() => {
        return () => {
            if (lookupTimerRef.current) {
                clearTimeout(lookupTimerRef.current);
            }
        };
    }, []);

    const handleSort = useCallback((column) => {
        setSortBy((previous) => {
            if (previous === column) {
                setSortDirection((dir) => {
                    return dir === 'asc'
                        ? 'desc'
                        : 'asc';
                });

                return column;
            }

            setSortDirection('desc');

            return column;
        });
    }, []);

    const handleSortDiff = useCallback(() => {
        handleSort('diff');
    }, [ handleSort ]);

    const handleSortPrice = useCallback(() => {
        handleSort('price');
    }, [ handleSort ]);

    const sortedItems = useMemo(() => {
        if (sortBy === 'default') {
            return itemsWithIsbn;
        }

        return [ ...itemsWithIsbn ].sort((a, b) => {
            const multiplier = sortDirection === 'desc'
                ? -1
                : 1;

            if (sortBy === 'price') {
                return multiplier * ((a.currentPrice || 0) - (b.currentPrice || 0));
            }

            if (sortBy === 'diff') {
                const aPrices = bokborsenPrices[ a.isbn ];
                const bPrices = bokborsenPrices[ b.isbn ];

                // Items without bokbörsen data go to the bottom
                if (!aPrices && !bPrices) {
                    return 0;
                }

                if (!aPrices) {
                    return 1;
                }

                if (!bPrices) {
                    return -1;
                }

                const aDiff = aPrices.low - (a.currentPrice || 0);
                const bDiff = bPrices.low - (b.currentPrice || 0);

                return multiplier * (aDiff - bDiff);
            }

            return 0;
        });
    }, [
        bokborsenPrices,
        itemsWithIsbn,
        sortBy,
        sortDirection,
    ]);

    const getRowBackground = useCallback((item) => {
        const prices = bokborsenPrices[ item.isbn ];

        if (!prices) {
            return 'inherit';
        }

        const itemPrice = Number(item.currentPrice) || 0;

        if (itemPrice < prices.low) {
            return 'rgba(46, 125, 50, 0.08)';
        }

        if (itemPrice > prices.high) {
            return 'rgba(211, 47, 47, 0.06)';
        }

        return 'inherit';
    }, [ bokborsenPrices ]);

    const getDiffLabel = useCallback((item) => {
        const prices = bokborsenPrices[ item.isbn ];

        if (!prices) {
            return null;
        }

        const diff = prices.low - (Number(item.currentPrice) || 0);

        if (diff > 0) {
            return `+${formatPrice(diff)}`;
        }

        return formatPrice(diff);
    }, [ bokborsenPrices ]);

    const lookedUpCount = Object.keys(bokborsenPrices).length;

    return [
        <Box
            key = 'header'
            sx = {{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 3,
                marginTop: 4,
            }}
        >
            <Box>
                <Typography
                    color = '#fff'
                    sx = {{
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                    variant = 'h4'
                >
                    {'ISBN-fynd'}
                </Typography>
                <Typography
                    color = '#fff'
                    sx = {{
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                    variant = 'body1'
                >
                    {'Objekt med ISBN — jämför med Bokbörsen för att hitta fynd.'}
                </Typography>
            </Box>
            {itemsWithIsbn.length > 0 && (
                <Button
                    disabled = {isLookingUpAll}
                    onClick = {handleLookupAll}
                    startIcon = {isLookingUpAll
                        ? (
                            <CircularProgress
                                size = {18}
                            />
                        )
                        : <PlaylistAddCheckIcon />}
                    sx = {{
                        flexShrink: 0,
                        textShadow: 'none',
                    }}
                    variant = 'contained'
                >
                    {isLookingUpAll
                        ? `Söker... (${lookedUpCount}/${itemsWithIsbn.length})`
                        : 'Sök alla på Bokbörsen'
                    }
                </Button>
            )}
        </Box>,
        <Box
            key = 'content'
        >
            {isSearching && (
                <Box
                    sx = {{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 1,
                        marginBottom: 2,
                    }}
                >
                    <CircularProgress
                        size = {24}
                    />
                    <Typography
                        color = '#fff'
                        variant = 'body1'
                    >
                        {'Söker efter ISBN-objekt...'}
                    </Typography>
                </Box>
            )}
            {isSearchError && (
                <Alert
                    severity = 'error'
                    sx = {{
                        marginBottom: 2,
                    }}
                >
                    {'Kunde inte hämta sökresultat.'}
                </Alert>
            )}
            {!isSearching && itemsWithIsbn.length === 0 && !isSearchError && (
                <Alert
                    severity = 'info'
                >
                    {'Inga objekt med ISBN hittades.'}
                </Alert>
            )}
            {sortedItems.length > 0 && (
                <TableContainer
                    sx = {{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 2,
                        marginBottom: 4,
                    }}
                >
                    <Table
                        size = 'small'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    {'Titel'}
                                </TableCell>
                                <TableCell>
                                    {'ISBN'}
                                </TableCell>
                                <TableCell>
                                    {'Källa'}
                                </TableCell>
                                <TableCell
                                    align = 'right'
                                    sortDirection = {sortBy === 'price'
                                        ? sortDirection
                                        : false}
                                >
                                    <TableSortLabel
                                        active = {sortBy === 'price'}
                                        direction = {sortBy === 'price'
                                            ? sortDirection
                                            : 'desc'}
                                        onClick = {handleSortPrice}
                                    >
                                        {'Pris'}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    align = 'right'
                                >
                                    {'Bokbörsen'}
                                </TableCell>
                                <TableCell
                                    align = 'right'
                                    sortDirection = {sortBy === 'diff'
                                        ? sortDirection
                                        : false}
                                >
                                    <TableSortLabel
                                        active = {sortBy === 'diff'}
                                        direction = {sortBy === 'diff'
                                            ? sortDirection
                                            : 'desc'}
                                        onClick = {handleSortDiff}
                                    >
                                        {'Diff'}
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedItems.map((item) => {
                                const diffLabel = getDiffLabel(item);

                                return (
                                    <TableRow
                                        hover
                                        key = {item.url}
                                        sx = {{
                                            backgroundColor: getRowBackground(item),
                                        }}
                                    >
                                        <TableCell
                                            sx = {{
                                                padding: '4px',
                                                width: 50,
                                            }}
                                        >
                                            {item.imageUrl && (
                                                <Box
                                                    alt = {item.title}
                                                    component = 'img'
                                                    src = {`${IMAGE_PROXY}/?url=${
                                                        encodeURIComponent(item.imageUrl)
                                                    }&w=50&h=50&fit=contain&output=webp`}
                                                    sx = {{
                                                        borderRadius: 1,
                                                        height: 50,
                                                        objectFit: 'contain',
                                                        width: 50,
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href = {item.url}
                                                rel = 'noopener noreferrer'
                                                target = '_blank'
                                                underline = 'hover'
                                            >
                                                {item.title}
                                                <OpenInNewIcon
                                                    sx = {{
                                                        fontSize: 14,
                                                        marginLeft: 0.5,
                                                        verticalAlign: 'middle',
                                                    }}
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx = {{
                                                    fontFamily: 'monospace',
                                                }}
                                                variant = 'body2'
                                            >
                                                {item.isbn}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.type}
                                        </TableCell>
                                        <TableCell
                                            align = 'right'
                                        >
                                            {formatPrice(item.currentPrice)}
                                        </TableCell>
                                        <BokborsenCell
                                            isbn = {item.isbn}
                                            onResult = {handleBokborsenResult}
                                            shouldLookup = {Boolean(lookupIsbns[ item.isbn ])}
                                        />
                                        <TableCell
                                            align = 'right'
                                        >
                                            {diffLabel && (
                                                <Typography
                                                    color = {diffLabel.startsWith('+')
                                                        ? 'success.main'
                                                        : 'error.main'}
                                                    sx = {{
                                                        fontWeight: 600,
                                                    }}
                                                    variant = 'body2'
                                                >
                                                    {diffLabel}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>,
    ];
};

export default IsbnDeals;
