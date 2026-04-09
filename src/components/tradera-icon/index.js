// eslint-disable-next-line no-process-env, no-undef
const PUBLIC_URL = process.env.PUBLIC_URL;

const TraderIcon = () => {
    return (<div
        alt = 'Tradera'
        style = {{
            backgroundImage: `url(${PUBLIC_URL}/images/icons/tradera-40x40.png)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            height: '20px',
            marginLeft: '4px',
            // maxWidth: '7px',
            // transform: 'scale(4)',
            width: '20px',
        }}
    />);
};

export default TraderIcon;
