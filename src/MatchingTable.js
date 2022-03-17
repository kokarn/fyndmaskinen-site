import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Countdown from 'react-countdown-now';

import countdownRenderer from './countown-renderer.js';
import './App.css';

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
