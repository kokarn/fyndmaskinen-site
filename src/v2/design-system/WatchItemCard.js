import PropTypes from 'prop-types';
import {
    useCallback,
    useState,
} from 'react';
import {
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Stack,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import {
    Link,
} from 'react-router-dom';

import availableSources from '../../sources';
import {
    buildWatchFilters,
    getDefaultSourceState,
    getSourceStateFromIds,
} from '../search-state';
import FilterPanel from './FilterPanel';
import SourceMark from './SourceMark';

const getSourceDisplay = (sourceId) => {
    const source = availableSources.find((candidate) => {
        return candidate.id === sourceId || candidate.ids?.includes(sourceId);
    });

    return {
        id: source?.id || sourceId,
        label: source?.label || sourceId,
    };
};

const WatchItemCard = ({
    isSaving,
    match,
    maxPrice,
    onDelete,
    onEditSave,
    sources,
}) => {
    const [
        sourcesOpen, setSourcesOpen,
    ] = useState(false);
    const [
        editing, setEditing,
    ] = useState(false);
    const [
        editSourceState, setEditSourceState,
    ] = useState(() => {
        return getDefaultSourceState(availableSources);
    });
    const [
        editMaxPrice, setEditMaxPrice,
    ] = useState('');
    const displaySources = sources === null
        ? null
        : [
            ...new Map(sources.map((sourceId) => {
                const source = getSourceDisplay(sourceId);

                return [
                    source.id,
                    source,
                ];
            })).values(),
        ];
    const handleDelete = useCallback((event) => {
        onDelete(event.currentTarget.dataset.match);
    }, [ onDelete ]);
    const handleSourcesToggle = useCallback(() => {
        setSourcesOpen((previous) => {
            return !previous;
        });
    }, []);
    const handleEditOpen = useCallback(() => {
        setEditSourceState(getSourceStateFromIds(sources, availableSources));
        setEditMaxPrice(maxPrice === null
            ? ''
            : String(maxPrice));
        setEditing(true);
    }, [
        maxPrice,
        sources,
    ]);
    const handleEditCancel = useCallback(() => {
        setEditing(false);
    }, []);
    const handleEditSourceChange = useCallback((event) => {
        const sourceId = event.target.value;

        setEditSourceState((previous) => {
            return {
                ...previous,
                [ sourceId ]: !previous[ sourceId ],
            };
        });
    }, []);
    const handleEditMaxPriceChange = useCallback((event) => {
        setEditMaxPrice(event.target.value.replace(/[^0-9]/gu, ''));
    }, []);
    const handleEditReset = useCallback(() => {
        setEditSourceState(getDefaultSourceState(availableSources));
        setEditMaxPrice('');
    }, []);
    const handleEditSave = useCallback(() => {
        onEditSave(match, buildWatchFilters({
            availableSources,
            maxPrice: editMaxPrice,
            sourceState: editSourceState,
        }));
        setEditing(false);
    }, [
        editMaxPrice,
        editSourceState,
        match,
        onEditSave,
    ]);
    const allSourcesSelected = displaySources === null
        || availableSources.every((source) => {
            return displaySources.some((selected) => {
                return selected.id === source.id;
            });
        });
    const sourceSummary = allSourcesSelected
        ? 'Alla marknadsplatser'
        : `${displaySources.length} valda marknadsplatser`;

    return (
        <Card
            variant = 'outlined'
        >
            <CardContent
                sx = {{
                    '&:last-child': {
                        paddingBottom: 2,
                    },
                    alignItems: {
                        sm: 'center',
                        xs: 'stretch',
                    },
                    display: 'flex',
                    flexDirection: {
                        sm: 'row',
                        xs: 'column',
                    },
                    gap: 1.5,
                    justifyContent: 'space-between',
                    padding: 2,
                }}
            >
                <Stack
                    spacing = {1}
                    sx = {{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        component = {Link}
                        sx = {{
                            color: 'text.primary',
                            fontWeight: 800,
                            textDecoration: 'none',
                        }}
                        to = {`/search/${encodeURIComponent(match)}`}
                    >
                        {match}
                    </Typography>
                    <Stack
                        alignItems = 'flex-start'
                        spacing = {0.75}
                    >
                        <Button
                            aria-expanded = {sourcesOpen}
                            endIcon = {<ExpandMoreIcon />}
                            onClick = {handleSourcesToggle}
                            size = 'small'
                            sx = {{
                                justifyContent: 'flex-start',
                                paddingX: 0.75,
                                textAlign: 'left',
                            }}
                            variant = 'text'
                        >
                            {sourceSummary}
                        </Button>
                        <Collapse
                            in = {sourcesOpen}
                        >
                            <Stack
                                direction = 'row'
                                flexWrap = 'wrap'
                                gap = {0.75}
                            >
                                {allSourcesSelected && (
                                    <Typography
                                        color = 'text.secondary'
                                        variant = 'caption'
                                    >
                                        {'Alla anslutna marknadsplatser ingår.'}
                                    </Typography>
                                )}
                                {!allSourcesSelected && displaySources?.map((source) => {
                                    return (
                                        <SourceMark
                                            compact
                                            key = {source.id}
                                            label = {source.label}
                                            sourceId = {source.id}
                                        />
                                    );
                                })}
                            </Stack>
                        </Collapse>
                        {maxPrice !== null && (
                            <Chip
                                label = {`Maxpris: ${maxPrice.toLocaleString('sv-SE')} kr`}
                                size = 'small'
                                variant = 'outlined'
                            />
                        )}
                    </Stack>
                </Stack>
                <Stack
                    direction = {{
                        sm: 'column',
                        xs: 'row',
                    }}
                    spacing = {0.5}
                    sx = {{
                        alignItems: {
                            sm: 'flex-end',
                            xs: 'stretch',
                        },
                        flexShrink: 0,
                    }}
                >
                    {onEditSave && (
                        <Button
                            aria-expanded = {editing}
                            aria-label = {`Ändra filter för ${match}`}
                            onClick = {handleEditOpen}
                            startIcon = {<TuneIcon />}
                            sx = {{
                                flex: {
                                    sm: 'none',
                                    xs: 1,
                                },
                                whiteSpace: 'nowrap',
                            }}
                            variant = 'text'
                        >
                            {'Ändra filter'}
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            aria-label = {`Ta bort bevakningen ${match}`}
                            color = 'secondary'
                            data-match = {match}
                            onClick = {handleDelete}
                            startIcon = {<DeleteOutlineIcon />}
                            sx = {{
                                flex: {
                                    sm: 'none',
                                    xs: 1,
                                },
                                whiteSpace: 'nowrap',
                            }}
                            variant = 'text'
                        >
                            {'Ta bort'}
                        </Button>
                    )}
                </Stack>
            </CardContent>
            {onEditSave && (
                <Collapse
                    in = {editing}
                    unmountOnExit
                >
                    <CardContent
                        sx = {{
                            '&:last-child': {
                                paddingBottom: 2,
                            },
                            paddingTop: 0,
                            paddingX: 2,
                        }}
                    >
                        <FilterPanel
                            applyLabel = {isSaving
                                ? 'Sparar…'
                                : 'Spara filter'}
                            maxPrice = {editMaxPrice}
                            onApply = {handleEditSave}
                            onMaxPriceChange = {handleEditMaxPriceChange}
                            onReset = {handleEditReset}
                            onSourceChange = {handleEditSourceChange}
                            showSort = {false}
                            sourceState = {editSourceState}
                            sources = {availableSources}
                        />
                        <Button
                            fullWidth
                            onClick = {handleEditCancel}
                            sx = {{
                                marginTop: 1,
                            }}
                            variant = 'text'
                        >
                            {'Avbryt'}
                        </Button>
                    </CardContent>
                </Collapse>
            )}
        </Card>
    );
};

WatchItemCard.defaultProps = {
    isSaving: false,
    maxPrice: null,
    onDelete: null,
    onEditSave: null,
    sources: null,
};

WatchItemCard.propTypes = {
    isSaving: PropTypes.bool,
    match: PropTypes.string.isRequired,
    maxPrice: PropTypes.number,
    onDelete: PropTypes.func,
    onEditSave: PropTypes.func,
    sources: PropTypes.arrayOf(PropTypes.string),
};

export default WatchItemCard;
