import React, {
    Component,
} from 'react';
import {
    withStyles,
} from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import LiveAuction from './LiveAuction.js';

const styles = ( theme ) => {
    return  {
        selector: {
            margin: '0 20px',
            top: 31,
        },
        submit: {
            margin: '0 20px',
            top: 20,
        },
    };
};

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
                    auctionID = { auction.auctionID }
                    house = { auction.house }
                    key = { `${ auction.house } - ${ auction.auctionID }` }
                />
            );
        } );
    }

    handleHouseSelect ( event ) {
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

    render () {
        return [
            <div
                className = { 'live-items-wrapper' }
            >
                { this.getLive() }
                <form
                    autoComplete = 'off'
                    noValidate
                >
                    <Select
                        className = { this.props.classes.selector }
                        inputProps = { {
                            name: 'house',
                            id: 'house-simple',
                        } }
                        onChange = { this.handleHouseSelect }
                        value = { this.state.selectedHouse }
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
                        id = 'standard-name'
                        label = 'Name'
                        margin = 'normal'
                        onChange = { this.handleAuctionIdUpdate }
                        value = { this.name }
                    />
                    <Button
                        className = { this.props.classes.submit }
                        color = { 'primary' }
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

export default withStyles( styles )( Live );
