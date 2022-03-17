import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import { Textfit } from 'react-textfit';

const PERCENTAGE_SIZE = 16;
const TITLE_MAX_LENGTH = 35;

const imageSize = Math.floor( window.outerWidth / 100 * PERCENTAGE_SIZE );

const styles = theme => ( {
    liveCard: {
        marginBottom: '1%',
        width: `${ PERCENTAGE_SIZE }%`,
    },
    liveCardMedia: {
        height: imageSize,
    }
} );

class LiveItem extends Component {
    getIcon () {
        if ( this.props.timeLeft > 0 ) {
            return <AddIcon />
        }

        return <CheckIcon />;
    }

    getTitle () {
        let titleString = this.props.title;

        if ( titleString.length > TITLE_MAX_LENGTH ) {
            titleString = `${ titleString.substring( 0, TITLE_MAX_LENGTH - 1 ) }...`;
        }

        return titleString;
    }

    render () {
        return (
            <Card
                className = { this.props.classes.liveCard }
            >
                <CardActionArea
                    href = { this.props.url }
                >
                    <CardMedia
                        className = { this.props.classes.liveCardMedia }
                        image = { `https://images.weserv.nl/?url=${ this.props.img }&w=${ imageSize }&h=${ imageSize }&t=letterbox&bg=black` }
                        title = { this.props.title }
                    />
                    <CardContent>
                        <Textfit
                            mode = { 'single' }
                            max = { 24 }
                        >
                            { this.getTitle() }
                        </Textfit>
                    </CardContent>
                    <CardActions
                        disableActionSpacing
                    >
                        { this.props.timeLeft }s kvar
                        <Tooltip
                            title = { `Lägg bud på ${ this.props.nextBid } kr` }
                            placement = { 'top' }
                        >
                            <Button
                                className = { 'live-price-button' }
                                color = { 'primary' }
                                disabled = { this.props.timeLeft === 0 }
                                size="small"
                                variant="contained"
                            >
                                { this.getIcon() }
                                { this.props.currentBid } kr
                            </Button>
                        </Tooltip>
                    </CardActions>
                </CardActionArea>
            </Card>
        );
    }
}

export default withStyles(styles)(LiveItem);
