import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import LiveAuction from './LiveAuction.js';

const styles = theme => ( {
    selector: {
        margin: '0 20px',
        top: 31,
    },
    submit: {
        margin: '0 20px',
        top: 20,
    },
} );

class Live extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            auctions: [],
            currentAuctionID: false,
            selectedHouse: 'gta',
            houses: [
                'gta',
                'ea',
            ],
        };

        this.getLive = this.getLive.bind( this );
        this.handleHouseSelect = this.handleHouseSelect.bind( this );
        this.handleLiveAuctionAdd = this.handleLiveAuctionAdd.bind( this );
        this.handleAuctionIdUpdate = this.handleAuctionIdUpdate.bind( this );
    }

    getLive () {
        return this.state.auctions.map( ( auction ) => {
            return (
                <LiveAuction
                    key = { `${ auction.house } - ${ auction.auctionID }` }
                    house = { auction.house }
                    auctionID = { auction.auctionID }
                />
            );
        } );
    }

    handleHouseSelect( event ) {
        this.setState( {
            selectedHouse: event.target.value,
        } );
    }

    handleAuctionIdUpdate ( event ) {
        this.setState( {
            currentAuctionID: event.target.value,
        } );
    }

    handleLiveAuctionAdd ( event ) {
        const newAuctions = [ ...this.state.auctions ];

        newAuctions.push( {
            house: this.state.selectedHouse,
            auctionID: this.state.currentAuctionID,
        } );

        this.setState( {
            auctions: newAuctions,
        } );
    }

    render() {
        return [
            <div
                className = { 'live-items-wrapper' }
            >
                { this.getLive() }
                <form
                    noValidate
                    autoComplete="off"
                >
                    <Select
                        className = { this.props.classes.selector }
                        value = { this.state.selectedHouse }
                        onChange = { this.handleHouseSelect }
                        inputProps = { {
                            name: 'house',
                            id: 'house-simple',
                        } }
                    >
                        <MenuItem
                            value = { 'gta' }
                        >
                            { 'Göteborgs Auktionskammare' }
                        </MenuItem>
                        <MenuItem
                            value = { 'ea' }
                        >
                            { 'ea' }
                        </MenuItem>
                    </Select>
                    <TextField
                        id = "standard-name"
                        label = "Name"
                        value = { this.name }
                        onChange = { this.handleAuctionIdUpdate }
                        margin = "normal"
                    />
                    <Button
                        color = { 'primary' }
                        className = { this.props.classes.submit }
                        onClick = { this.handleLiveAuctionAdd }
                        variant = { 'contained' }
                    >
                        { 'View' }
                    </Button>
                </form>
            </div>,
        ];
    }
}

export default withStyles(styles)(Live);
