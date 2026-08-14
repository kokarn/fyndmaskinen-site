import PropTypes from 'prop-types';
import {
    Alert,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Countdown from 'react-countdown-now';

import countdownRenderer from '../countown-renderer';

const columns = {
    matching: [
        'Annons',
        'Bud',
        'Värde',
        'Möjlig vinst',
        'Startar',
    ],
    missing: [
        'Annons',
        'Bästa träff',
        'Säkerhet',
        'Bud',
        'Startar',
    ],
};

const DealTable = ({
    items,
    type,
}) => {
    if (!items.length) {
        return (
            <Alert
                severity = 'info'
            >
                {type === 'matching'
                    ? 'Inga matchande fynd just nu.'
                    : 'Inga omatchade annonser just nu.'}
            </Alert>
        );
    }

    const sortedItems = [ ...items ].sort((a, b) => {
        if (type === 'matching') {
            return (Number(b.value) - Number(b.bid)) - (Number(a.value) - Number(a.bid));
        }

        return (a.title || '').localeCompare(b.title || '');
    });

    return (
        <Stack
            spacing = {1.5}
        >
            <Typography
                variant = 'h5'
            >
                {type === 'matching'
                    ? 'Matchande fynd'
                    : 'Saknar säker match'}
            </Typography>
            <TableContainer
                component = {Paper}
            >
                <Table
                    size = 'small'
                >
                    <TableHead>
                        <TableRow>
                            {columns[ type ].map((column, index) => {
                                return (
                                    <TableCell
                                        align = {index === 0
                                            ? 'left'
                                            : 'right'}
                                        key = {column}
                                    >
                                        {column}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedItems.map((row) => {
                            const cells = type === 'matching'
                                ? [
                                    [
                                        'bid', row.bid,
                                    ],
                                    [
                                        'value', row.value,
                                    ],
                                    [
                                        'profit', Number(row.value) - Number(row.bid),
                                    ],
                                ]
                                : [
                                    [
                                        'best-match', row.bestMatch,
                                    ],
                                    [
                                        'rating', row.matchRating,
                                    ],
                                    [
                                        'bid', row.bid,
                                    ],
                                ];

                            return (
                                <TableRow
                                    hover
                                    key = {`${row.url}-${row.matcher || row.title}`}
                                >
                                    <TableCell>
                                        <Link
                                            href = {row.url}
                                            rel = 'noopener noreferrer'
                                            target = '_blank'
                                            underline = 'hover'
                                        >
                                            {row.title}
                                            <OpenInNewIcon
                                                sx = {{
                                                    fontSize: 14,
                                                    marginLeft: 0.5,
                                                    verticalAlign: 'middle',
                                                }}
                                            />
                                        </Link>
                                    </TableCell>
                                    {cells.map(([
                                        cellKey, value,
                                    ]) => {
                                        return (
                                            <TableCell
                                                align = 'right'
                                                key = {`${row.url}-${cellKey}`}
                                            >
                                                {value ?? '–'}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell
                                        align = 'right'
                                    >
                                        <Countdown
                                            date = {row.startTime}
                                            renderer = {countdownRenderer}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

DealTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        bestMatch: PropTypes.string,
        bid: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        matcher: PropTypes.string,
        matchRating: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        startTime: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        title: PropTypes.string,
        url: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    })).isRequired,
    type: PropTypes.oneOf([
        'matching',
        'missing',
    ]).isRequired,
};

export default DealTable;
