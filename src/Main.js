import React, { Component } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

class Main extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            deals: false,
            search: '',
            searchItems: [],
            showLoading: false,
            totalItems: 0,
            validSearch: false,
        };

        this.searchTimeout = false;

        this.search = this.search.bind( this );
        this.handleFilterChange = this.handleFilterChange.bind( this );

        // this.errorImage = `https://images.weserv.nl/?url=i.imgur.com/PPVXbBi.jpg&w=200&h=200&t=letterbox&bg=black`;
        // this.errorImage = `https://i.imgur.com/fFRz0s0.jpg`;
        this.errorImage = `https://fyndmaskinen.pages.dev/images/no-image.jpg`;
    }

    search() {
        fetch( `${ window.API_HOSTNAME }/graphql`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { query: `{
                  findItems( match: "${ this.state.search }" ) {
                    title
                    url
                    currentPrice
                    img
                    startTime
                  }
                }` } ),
            }
        )
        .then( ( response ) => {
            return response.json();
        } )
        .then( ( response ) => {
            this.setState( {
                searchItems: response.data.findItems.slice( 0, 40 ),
                showLoading: false,
                validSearch: true,
            } );
        } )
        .catch( ( fetchError  ) => {
            console.error( fetchError );
        } )
    }

    handleFilterChange( event ) {
        this.setState( {
            search: event.target.value,
            showLoading: true,
        } );

        clearTimeout( this.searchTimeout );

        if ( event.target.value.length <= 2 ) {
            this.setState( {
                searchItems: [],
                showLoading: false,
                validSearch: false,
            } );

            return true;
        }

        this.searchTimeout = setTimeout( () => {
            this.search();
        }, 300 );
    }

    getSearchTable() {
        if ( this.state.searchItems.length <= 0 ) {
            return null;
        }

        return this.state.searchItems.map( ( tile ) => {
            let currentPrice = <span>Nuvarande bud: { tile.currentPrice }</span>;

            if ( tile.currentPrice === -1 ) {
                currentPrice = <span>Förhandsvisning</span>;
            }
            // src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=crop&a=center` }
            // src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=letterbox&bg=white` }
            return <GridListTile
                key = { tile.img }
            >
                <img
                    src = { `https://images.weserv.nl/?url=${ tile.img }&w=200&h=200&t=letterbox&bg=black&errorredirect=${ this.errorImage }` }
                    alt = { tile.title }
                />
                <GridListTileBar
                    title = { tile.title }
                    subtitle = { currentPrice }
                    actionIcon = {
                        <IconButton
                            href = { tile.url }
                        >
                            <InfoIcon
                                className = { 'icon' }
                            />
                        </IconButton>
                    }
                />
            </GridListTile>
        } )
    }

    getGridListCols() {
        // if (isWidthUp('xl', this.props.width)) {
        //     return 4;
        // }

        if ( isWidthUp( 'lg', this.props.width ) ) {
            return 5;
        }

        if ( isWidthUp( 'md', this.props.width ) ) {
            return 2;
        }

        return 1;
    }

    render() {
        return (
            <div className="App">
                <div className = { 'gridlist-root' }>
                  <Grid
                      container
                      spacing = { 24 }
                      alignItems = { 'flex-end' }
                  >
                      <Grid
                          item
                          md = { 12 }
                          xs = { 8 }
                      >
                          <form
                            noValidate
                            autoComplete="off"
                        >
                              <TextField
                                    fullWidth
                                  id = 'standard-name'
                                  label = { 'Sök' }
                                  value = { this.state.search }
                                  onChange = { this.handleFilterChange }
                                  margin = 'normal'
                              />
                              { this.state.showLoading &&
                                  <div>
                                      Söker...
                                  </div>
                              }
                              {/* <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label="Auctions"
                                />
                                <FormControlLabel
                                    disabled
                                    control={<Checkbox />}
                                    label="Blocket"
                                />
                                <FormControlLabel
                                    disabled
                                    control={<Checkbox />}
                                    label="Marketplace"
                                />
                            </FormGroup> */}
                          </form>
                      </Grid>
                      <Grid
                          item
                          md = { 12 }
                        //   xs = { 4 }
                      >
                          { this.state.validSearch && <Typography
                              align = { 'left' }
                              variant = { 'h6' }
                          >
                              { `Hittade ${ this.state.searchItems.length } objekt för sökningen ${ this.state.search }` }
                          </Typography> }
                      </Grid>
                      <Grid
                          item
                          xs = { 12 }
                      >
                          <GridList
                              cellHeight = { 'auto' }
                              className = { 'gridList' }
                              cols = { this.getGridListCols() }
                              spacing = { 4 }
                          >
                              { this.getSearchTable() }
                          </GridList>
                      </Grid>
                  </Grid>
              </div>
            </div>
        );
    }
}

export default withWidth()(Main);
