import React, {
    Component,
} from 'react';
import {
    withStyles,
} from '@mui/material/styles';

import Fab from '@mui/material/Fab';

import LiveItem from './LiveItem.js';

const styles = (theme) => {
    return  {
        fab: {
            bottom: 20,
            position: 'fixed',
            right: 20,
        },
    };
};

class LiveAuction extends Component {
    constructor (props) {
        super(props);

        this.state = {
            timeLeft: 0,
            live: [],
        };

        this.getLiveItems = this.getLiveItems.bind(this);
        this.notification = new Audio('bell_ring.mp3');
    }

    componentDidMount () {
        this.updateData();

        // setInterval( this.updateData.bind( this ), 2000 );
    }

    updateData () {
        fetch(
            `${ window.API_HOSTNAME }/graphql`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `{
                  live( house: "${ this.props.house }", auctionID: "${ this.props.auctionID }" ) {
                    currentBid
                    highBidder
                    nextBid
                    timeLeft
                    imageUrl
                    url
                    item {
                        title
                        url
                        currentPrice
                        imageUrl
                        startTime
                    }
                  }
                }`,
                }),
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                let timeLeft = 0;

                response.data.live.map((liveItem) => {
                    if (liveItem.timeLeft > timeLeft) {
                        timeLeft = liveItem.timeLeft;
                    }

                    return true;
                });

                if (this.state.live[ 0 ] && this.state.live[ 0 ].url !== response.data.live[ 0 ].url) {
                    this.notification.play();
                }

                this.setState({
                    live: response.data.live,
                    timeLeft: timeLeft,
                });
            })
            .catch((fetchError) => {
                console.error(fetchError);
            });
    }

    getLiveItems () {
        return this.state.live.map((liveItem) => {
            return (
                <LiveItem
                    currentBid = { liveItem.currentBid }
                    img = { liveItem.imageUrl }
                    nextBid = { liveItem.nextBid }
                    timeLeft = { liveItem.timeLeft }
                    title = { liveItem.item.title }
                    url = { liveItem.url }
                />
            );
        });
    }

    render () {
        return [
            <div
                className = { 'live-items-wrapper' }
            >
                { this.getLiveItems() }
                <Fab
                    className = { this.props.classes.fab }
                    color = { 'primary' }
                    variant = 'extended'
                >
                    { this.state.timeLeft }
                </Fab>
            </div>,
            // <div
            //     className = { 'live-items-wrapper' }
            // >
            //     { this.getLiveItems() }
            //     <Fab
            //         className = { this.props.classes.fab }
            //         color = { 'primary' }
            //         variant = "extended"
            //     >
            //         { this.state.timeLeft }
            //     </Fab>
            // </div>
        ];
    }
}

export default withStyles(styles)(LiveAuction);
