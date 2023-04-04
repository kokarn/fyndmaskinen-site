import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
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
window.PORTAL_URL = 'https://billing.stripe.com/p/login/bIY14V4oKdcnfp6bII';
window.PURCHASE_URL = 'https://buy.stripe.com/9AQ01k56V4Zv3rWeUU';

if (window.location.origin.includes('localhost')) {
    // window.API_HOSTNAME = 'http://localhost:4080';
    window.PORTAL_URL = 'https://billing.stripe.com/p/login/test_9AQcNLbeM8CSbnO000';
    window.PURCHASE_URL = 'https://buy.stripe.com/test_7sIdSJ338d2i9hu28a';
}

const queryClient = new QueryClient();
const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render((
    <React.StrictMode>
        <Auth0Provider
            clientId = 'pGEsN4mWTCZiRbKxXR5pPqu6y5IXxuhQ'
            domain = 'https://fyndmaskinen.eu.auth0.com'
            redirectUri = {`${window.location.origin}/profile`}
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
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
