import { useState, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';

import MatchingTable from '../../components/matching-table';
import MissingTable from '../../components/missing-table';

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [selectedTab, setSelectedTab] = useState(false);

    const updateData = () => {
        fetch( `${ window.API_HOSTNAME }/deals` )
            .then( ( response ) => {
                return response.json();
            } )
            .then( ( response ) => {
                setDeals(response.data);
            } )
            .catch( ( fetchError  ) => {
                console.error( fetchError );
            } );
    };

    useMemo(() => {
        updateData();
    }, []);

    const handleTabChange = ( event, value ) => {
        setSelectedTab(value);
    };

    const getTabs = () => {
        const tabs = [];

        for ( const identifier in deals ) {
            tabs.push( <Tab
                key = { identifier }
                label = { `${ identifier } ${ deals[ identifier ].matching.length } / ${ deals[ identifier ].missing.length }` }
                value = { identifier }
            /> );
        }

        return tabs;
    }

    return (
        <div>
            { deals &&
                <AppBar position="sticky">
                    <Toolbar>
                        <Tabs
                            centered
                            onChange = { handleTabChange }
                            value = { selectedTab }
                        >
                            { getTabs() }
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
                    { getSearchTable() }
                </GridList>
            </div>
            */ }
            { selectedTab &&
                <MatchingTable
                    items = { deals[ selectedTab ].matching  }
                />
            }
            { selectedTab &&
                <MissingTable
                    items = {deals[ selectedTab ].missing }
                />
            }
        </div>
    );
}

export default Deals;
