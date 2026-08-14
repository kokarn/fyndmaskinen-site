import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import Provider from './Provider';
import Admin from './pages/Admin';
import AdminWatches from './pages/AdminWatches';
import Barcode from './pages/Barcode';
import Deals from './pages/Deals';
import DesignSystem from './pages/DesignSystem';
import Home from './pages/Home';
import IsbnDeals from './pages/IsbnDeals';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';

const App = () => {
    return (
        <Provider>
            <Routes>
                <Route
                    element = {<Home />}
                    path = '/'
                />
                <Route
                    element = {<SearchResults />}
                    path = '/search/:searchString'
                />
                <Route
                    element = {<Home />}
                    path = '/search'
                />
                <Route
                    element = {<DesignSystem />}
                    path = '/design-system'
                />
                <Route
                    element = {<Profile />}
                    path = '/profile'
                />
                <Route
                    element = {<Notifications />}
                    path = '/notifications'
                />
                <Route
                    element = {<Admin />}
                    path = '/admin'
                />
                <Route
                    element = {<AdminWatches />}
                    path = '/admin/watches'
                />
                <Route
                    element = {<IsbnDeals />}
                    path = '/deals/isbn'
                />
                <Route
                    element = {<Deals />}
                    path = '/deals'
                />
                <Route
                    element = {<Barcode />}
                    path = '/barcode'
                />
                <Route
                    element = {<Barcode
                        variant = 'quagga'
                    />}
                    path = '/barcode/quagga'
                />
                <Route
                    element = {<Barcode
                        variant = 'zxing'
                    />}
                    path = '/barcode/zxing'
                />
                <Route
                    element = {<Barcode />}
                    path = '/barcode/html5-qrcode'
                />
                <Route
                    element = {<Navigate
                        replace
                        to = '/'
                    />}
                    path = '*'
                />
            </Routes>
        </Provider>
    );
};

export default App;
