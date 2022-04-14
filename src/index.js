import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import {
    BrowserRouter as Router,
} from 'react-router-dom';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import {
    Auth0Provider,
} from '@auth0/auth0-react';

window.API_HOSTNAME = 'https://d2cmhnbxvwhy7s.cloudfront.net';

if (window.location.origin.includes('localhost')) {
    window.API_HOSTNAME = 'https://localhost:4080';
}

const queryClient = new QueryClient();
const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render((
    <React.StrictMode>
        <Auth0Provider
            clientId = 'pGEsN4mWTCZiRbKxXR5pPqu6y5IXxuhQ'
            domain = 'https://fyndmaskinen.eu.auth0.com'
            redirectUri = {window.location.origin}
        >
            <QueryClientProvider
                client = {queryClient}
            >
                <Router>
                    <App />
                </Router>
            </QueryClientProvider>
        </Auth0Provider>
    </React.StrictMode>
));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
