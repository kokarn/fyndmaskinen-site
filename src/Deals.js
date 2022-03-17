import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';

import MatchingTable from './MatchingTable.js';
import MissingTable from './MissingTable.js';

class Deals extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            deals: [],
            selectedTab: false,
        };

        this.handleTabChange = this.handleTabChange.bind( this );
    }

    componentDidMount(){
        this.updateData();
    }

    updateData () {
        fetch( `${ window.API_HOSTNAME }/deals` )
            .then( ( response ) => {
                return response.json();
            } )
            .then( ( response ) => {
                this.setState( {
                    deals: response.data,
                    totalItems: response.totalItems,
                } );
            } )
            .catch( ( fetchError  ) => {
                console.error( fetchError );
            } );
    }

    handleTabChange ( event, value ) {
        this.setState( {
            selectedTab: value,
        } );
    };

    getTabs() {
        const tabs = [];

        for ( const identifier in this.state.deals ) {
            tabs.push( <Tab
                key = { identifier }
                label = { `${ identifier } ${ this.state.deals[ identifier ].matching.length } / ${ this.state.deals[ identifier ].missing.length }` }
                value = { identifier }
            /> );
        }

        return tabs;
    }

    render() {
        return (
            <div>
                { this.state.deals &&
                    <AppBar position="sticky">
                        <Toolbar>
                            <Tabs
                                centered
                                onChange = { this.handleTabChange }
                                value = { this.state.selectedTab }
                                >
                                { this.getTabs() }
                            </Tabs>
                        </Toolbar>
                    </AppBar>
                }
                { /*
                <div
                    className = { 'gridlist-root' }
                >
                    <GridList
                        cellHeight = { 'auto' }
                        className = { 'gridList' }
                        cols = { 6 }
                        spacing = { 5 }
                    >
                        <GridListTile
                            key = "search"
                            cols = { 6 }
                            style = { { height: 'auto', } }
                        >

                        </GridListTile>
                        { this.getSearchTable() }
                    </GridList>
                </div>
                */ }
                { this.state.selectedTab &&
                    <MatchingTable
                        items = { this.state.deals[ this.state.selectedTab ].matching  }
                    />
                }
                { this.state.selectedTab &&
                    <MissingTable
                        items = {this.state.deals[ this.state.selectedTab ].missing }
                    />
                }
            </div>
        );
    }
}

export default Deals;
