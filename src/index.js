import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

window.API_HOSTNAME = 'https://d2cmhnbxvwhy7s.cloudfront.net';

// window.API_HOSTNAME = 'https://localhost:4080';

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
