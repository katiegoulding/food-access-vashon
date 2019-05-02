import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'semantic-ui/dist/semantic.min.css';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyArFZbAeQ5YDelr8x-lChKbUvPvo2Z7GF8",
    authDomain: "fapadmin-97af8.firebaseapp.com",
    databaseURL: "https://fapadmin-97af8.firebaseio.com",
    projectId: "fapadmin-97af8",
    storageBucket: "fapadmin-97af8.appspot.com",
    messagingSenderId: "766068690399"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
