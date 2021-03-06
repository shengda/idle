import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as Sentry from '@sentry/browser';
import App from './App/App';
import * as serviceWorker from './serviceWorker';

Sentry.init({dsn: "https://56f5c0bce273442390d7f25698fefe53@sentry.io/1547544"});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
