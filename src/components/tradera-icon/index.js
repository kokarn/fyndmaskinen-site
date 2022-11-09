const TraderIcon = () => {
    return (<div
        alt = 'Tradera'
        // src = {`${process.env.PUBLIC_URL}/images/icons/tradera-100x100.png`}
        style = {{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/icons/tradera-40x40.png)`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            height: '20px',
            // maxWidth: '7px',
            // transform: 'scale(4)',
            width: '20px',
        }}
    />);
};

export default TraderIcon;
