import PropTypes from 'prop-types';
import {
    useCallback,
} from 'react';
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Link,
} from 'react-router-dom';

import availableSources from '../../sources';
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
    match,
    maxPrice,
    onDelete,
    sources,
}) => {
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

    return (
        <Card
            variant = 'outlined'
        >
            <CardContent
                sx = {{
                    '&:last-child': {
                        paddingBottom: 2,
                    },
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 2,
                }}
            >
                <Stack
                    spacing = {1}
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
                        direction = 'row'
                        flexWrap = 'wrap'
                        gap = {0.75}
                    >
                        {displaySources === null && (
                            <Chip
                                label = 'Alla marknadsplatser'
                                size = 'small'
                                variant = 'outlined'
                            />
                        )}
                        {displaySources?.map((source) => {
                            return (
                                <SourceMark
                                    compact
                                    key = {source.id}
                                    label = {source.label}
                                    sourceId = {source.id}
                                />
                            );
                        })}
                        {maxPrice !== null && (
                            <Chip
                                label = {`Maxpris: ${maxPrice.toLocaleString('sv-SE')} kr`}
                                size = 'small'
                                variant = 'outlined'
                            />
                        )}
                    </Stack>
                </Stack>
                {onDelete && (
                    <Button
                        aria-label = {`Ta bort bevakningen ${match}`}
                        color = 'secondary'
                        data-match = {match}
                        onClick = {handleDelete}
                        startIcon = {<DeleteOutlineIcon />}
                        variant = 'text'
                    >
                        {'Ta bort'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

WatchItemCard.defaultProps = {
    maxPrice: null,
    onDelete: null,
    sources: null,
};

WatchItemCard.propTypes = {
    match: PropTypes.string.isRequired,
    maxPrice: PropTypes.number,
    onDelete: PropTypes.func,
    sources: PropTypes.arrayOf(PropTypes.string),
};

export default WatchItemCard;
