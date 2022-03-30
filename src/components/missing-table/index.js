import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Countdown from 'react-countdown-now';

import countdownRenderer from '../../countown-renderer.js';

const MissingTable = ({
    items,
}) => {
    if (items.length <= 0) {
        return null;
    }

    const sortedItems = items.sort((a, b) => {
        return a.title.localeCompare(b.title);
    });

    return (
        <Grid
            item
            key = { 'matching' }
        >
            <Typography
                variant = { 'h6' }
            >
                { 'Missing' }
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            { 'Item title' }
                        </TableCell>
                        <TableCell
                            align = 'right'
                        >
                            { 'Best match' }
                        </TableCell>
                        <TableCell
                            align = 'right'
                        >
                            { 'Certainty' }
                        </TableCell>
                        <TableCell
                            align = 'right'
                        >
                            { 'Current bid' }
                        </TableCell>
                        <TableCell
                            align = 'right'
                        >
                            { 'Starting' }
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        sortedItems.map((row) => {
                            return (
                                <TableRow
                                    hover
                                    key = { `${ row.url }-${ row.matcher }` }
                                >
                                    <TableCell
                                        component = { 'th' }
                                        scope = { 'row' }
                                    >
                                        <a
                                            href = { row.url }
                                        >
                                            { row.title }
                                        </a>
                                    </TableCell>
                                    <TableCell
                                        align = 'right'
                                    >
                                        { row.bestMatch }
                                    </TableCell>
                                    <TableCell
                                        align = 'right'
                                    >
                                        { row.matchRating }
                                    </TableCell>
                                    <TableCell
                                        align = 'right'
                                    >
                                        { row.bid }
                                    </TableCell>
                                    <TableCell
                                        align = 'right'
                                    >
                                        <Countdown
                                            date = { row.startTime }
                                            renderer = { countdownRenderer }
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </Grid>
    );
};

MissingTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        bid: PropTypes.string,
        matcher: PropTypes.string,
        startTime: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string,
        value: PropTypes.string,
    })).isRequired,
};

export default MissingTable;
