import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import V2Provider from './v2/V2Provider';
import V2Admin from './v2/pages/Admin';
import V2AdminWatches from './v2/pages/AdminWatches';
import V2Barcode from './v2/pages/Barcode';
import V2Deals from './v2/pages/Deals';
import V2DesignSystem from './v2/pages/DesignSystem';
import V2Home from './v2/pages/Home';
import V2IsbnDeals from './v2/pages/IsbnDeals';
import V2Notifications from './v2/pages/Notifications';
import V2Profile from './v2/pages/Profile';
import V2SearchResults from './v2/pages/SearchResults';

const App = () => {
    return (
        <V2Provider>
            <Routes>
                <Route
                    element = {<V2Home />}
                    path = '/'
                />
                <Route
                    element = {<V2SearchResults />}
                    path = '/search/:searchString'
                />
                <Route
                    element = {<V2Home />}
                    path = '/search'
                />
                <Route
                    element = {<V2DesignSystem />}
                    path = '/design-system'
                />
                <Route
                    element = {<V2Profile />}
                    path = '/profile'
                />
                <Route
                    element = {<V2Notifications />}
                    path = '/notifications'
                />
                <Route
                    element = {<V2Admin />}
                    path = '/admin'
                />
                <Route
                    element = {<V2AdminWatches />}
                    path = '/admin/watches'
                />
                <Route
                    element = {<V2IsbnDeals />}
                    path = '/deals/isbn'
                />
                <Route
                    element = {<V2Deals />}
                    path = '/deals'
                />
                <Route
                    element = {<V2Barcode />}
                    path = '/barcode'
                />
                <Route
                    element = {<V2Barcode
                        variant = 'quagga'
                    />}
                    path = '/barcode/quagga'
                />
                <Route
                    element = {<V2Barcode
                        variant = 'zxing'
                    />}
                    path = '/barcode/zxing'
                />
                <Route
                    element = {<V2Barcode />}
                    path = '/barcode/html5-qrcode'
                />
                <Route
                    element = {<Navigate
                        replace
                        to = '/'
                    />}
                    path = '/v2'
                />
                <Route
                    element = {<V2DesignSystem />}
                    path = '/v2/design-system'
                />
                <Route
                    element = {<V2SearchResults />}
                    path = '/v2/search/:searchString'
                />
                <Route
                    element = {<Navigate
                        replace
                        to = '/'
                    />}
                    path = '*'
                />
            </Routes>
        </V2Provider>
    );
};

export default App;
