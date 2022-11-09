const BlocketIcon = () => {
    return (
        <div
            alt = 'Blocket'
            style = {{
                backgroundImage: `url(${process.env.PUBLIC_URL}/images/icons/blocket.png)`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                height: '20px',
                marginLeft: '4px',
                // maxWidth: '7px',
                // transform: 'scale(4)',
                width: '20px',
            }}
        />
    );
};

export default BlocketIcon;
