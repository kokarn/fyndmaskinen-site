import Auction2000Icon from './components/auction2000-icon';
import AuctionetIcon from './components/auctionet-icon';
import BlocketIcon from './components/blocket-icon';
import BukowskisIcon from './components/bukowskis-icon';
import TraderIcon from './components/tradera-icon';
import UppsalaAuktionskammareIcon from './components/uppsala-auktionskammare-icon';

const sources = [
    {
        defaultEnabled: true,
        icon: <Auction2000Icon />,
        id: 'auction2000',
        label: 'Mindre auktionshus',
    },
    {
        defaultEnabled: true,
        icon: <AuctionetIcon />,
        id: 'auctionet',
        label: 'Auctionet',
    },
    {
        defaultEnabled: true,
        icon: <BlocketIcon />,
        id: 'blocket',
        label: 'Blocket',
    },
    {
        defaultEnabled: true,
        icon: <BukowskisIcon />,
        id: 'bukowskis',
        label: 'Bukowskis',
    },
    {
        defaultEnabled: true,
        icon: <TraderIcon />,
        id: 'tradera',
        label: 'Tradera',
    },
    {
        defaultEnabled: true,
        icon: <UppsalaAuktionskammareIcon />,
        id: 'uppsala-auktionskammare',
        label: 'Uppsala Auktionskammare',
    },
];

export default sources;
