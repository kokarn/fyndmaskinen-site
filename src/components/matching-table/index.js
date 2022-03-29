import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Countdown from 'react-countdown-now';

import countdownRenderer from '../../countown-renderer.js';

class MatchingTable extends Component {
    render() {
        if ( this.props.items.length <= 0 ) {
            return null;
        }

        const sortedItems = this.props.items.sort( ( a, b ) => {
            const aProfit = a.value - a.bid;
            const bProfit = b.value - b.bid;

            if ( aProfit > bProfit ) {
                return -1;
            }

            if ( bProfit > aProfit ) {
                return 1;
            }

            return 0;
        } );

        return <Grid
            item
            className = { 'root' }
            key = { `matching` }
        >
            <Typography
                className = { 'table-title' }
                variant = { 'h6' }
            >
                { `Matching` }
            </Typography>
            <Table
                className = { 'table' }
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            { 'Item title' }
                        </TableCell>
                        <TableCell
                            align = "right"
                        >
                            { 'Current bid' }
                        </TableCell>
                        <TableCell
                            align = "right"
                        >
                            { 'Estimate value' }
                        </TableCell>
                        <TableCell
                            align = "right"
                        >
                            { 'Possible profit' }
                        </TableCell>
                        <TableCell
                            align = "right"
                        >
                            { 'Starting' }
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        sortedItems.map( ( row ) => {
                            return (
                                <TableRow
                                    key = { `${ row.url }-${ row.matcher }` }
                                    hover
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
                                    <TableCell align="right">
                                        { row.bid }
                                    </TableCell>
                                    <TableCell align="right">
                                        { row.value }
                                    </TableCell>
                                    <TableCell align="right">
                                        { row.value - row.bid }
                                    </TableCell>
                                    <TableCell align="right">
                                        <Countdown
                                            date = { row.startTime }
                                            renderer = { countdownRenderer }
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        } )
                    }
                </TableBody>
            </Table>
        </Grid>;
    }
}

export default MatchingTable;
