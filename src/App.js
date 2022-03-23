import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Main from './Main.js';
import Deals from './Deals.js';
import Live from './Live';
import Book from './pages/book2.jsx';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class App extends Component {
    constructor( props ) {
        super( props );

        this.classes = props.classes;
        this.state = {
            selectedTab: false,
            totalItems: 0,
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

    render() {
        return (
            <Router>
                <div
                    className = { this.classes.root }
                >
                    <AppBar
                        position = "static"
                    >
                        <Toolbar>
                            <Typography
                                color = { 'inherit' }
                                variant = { 'h5' }
                            >
                                <Link to="/">
                                    { 'Fyndmaskinen' }
                                </Link>
                            </Typography>
                            <Button
                                color = { 'inherit' }
                            >
                                <Link to="/deals">
                                    { 'Deals' }
                                </Link>
                            </Button>
                            <Button
                                color = { 'inherit' }
                            >
                                <Link to="/book2">
                                    { 'Book' }
                                </Link>
                            </Button>
                            {/* <Button
                                color = { 'inherit' }
                            >
                                <Link to="/live">
                                    { 'Live' }
                                </Link>
                            </Button> */}
                            <Typography
                                className = { this.classes.grow }
                                color = { 'inherit' }
                                align = { 'right' }
                            >
                                { `Sök bland ${ this.state.totalItems } objekt` }
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Route exact path="/" component={Main} />
                    <Route path="/deals" component={Deals} />
                    <Route path="/book2" component={Book} />
                    {/* <Route path="/live" component={Live} /> */}
                </div>
            </Router>
        );
    }
}

export default withStyles(styles)(App);
