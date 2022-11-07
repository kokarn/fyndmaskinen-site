import React, {
    Component,
} from 'react';
import {
    withStyles,
} from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

const PERCENTAGE_SIZE = 16;
const TITLE_MAX_LENGTH = 35;

const imageSize = Math.floor(window.outerWidth / 100 * PERCENTAGE_SIZE);

const styles = (theme) => {
    return  {
        liveCard: {
            marginBottom: '1%',
            width: `${ PERCENTAGE_SIZE }%`,
        },
        liveCardMedia: {
            height: imageSize,
        },
    };
};

class LiveItem extends Component {
    getIcon () {
        if (this.props.timeLeft > 0) {
            return <AddIcon />;
        }

        return <CheckIcon />;
    }

    getTitle () {
        let titleString = this.props.title;

        if (titleString.length > TITLE_MAX_LENGTH) {
            titleString = `${ titleString.substring(0, TITLE_MAX_LENGTH - 1) }...`;
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
                        image = { `https://wsrv.nl/?url=${ this.props.img }&w=${ imageSize }&h=${ imageSize }&t=letterbox&bg=black&output=webp` }
                        title = { this.props.title }
                    />
                    <CardContent>
                        { this.getTitle() }
                    </CardContent>
                    <CardActions
                        disableActionSpacing
                    >
                        { this.props.timeLeft }s kvar
                        <Tooltip
                            placement = { 'top' }
                            title = { `Lägg bud på ${ this.props.nextBid } kr` }
                        >
                            <Button
                                className = { 'live-price-button' }
                                color = { 'primary' }
                                disabled = { this.props.timeLeft === 0 }
                                size = 'small'
                                variant = 'contained'
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
