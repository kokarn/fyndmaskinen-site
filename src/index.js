import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

window.API_HOSTNAME = 'https://d2cmhnbxvwhy7s.cloudfront.net';

// window.API_HOSTNAME = 'https://localhost:4080';

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(<Router><App /></Router>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
