import React from 'react';

const renderer = ( inData ) => {
    // console.log( inData );
    const {
        days, hours, minutes, seconds, completed,
    } = inData;

    if ( completed ) {
        // Render a completed state
        return <div>Påbörjad</div>;
    }

    // Render a countdown
    return ( <span
        title = { inData.props.date }
             >
        { days }D { hours.toString().padStart( 2, '0' ) }H { minutes.toString().padStart( 2, '0' ) }M { seconds.toString().padStart( 2, '0' ) }s
             </span> );
};

export default renderer;
