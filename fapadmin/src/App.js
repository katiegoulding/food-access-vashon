import React, { Component } from 'react';

//import logo from './logo.svg';
import './App.css';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import constants from "./components/constants";


import MainActivity from "./components/MainActivity.jsx";
import LogInActivity from "./components/LogInActivity.jsx";
import CreateAccount from "./components/CreateAccount.jsx";
import AccountRecovery from "./components/AccountRecovery.jsx";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path={constants.routes.logIn} component={LogInActivity} />
            <Route path={constants.routes.createAccount} component={CreateAccount} />
            <Route path={constants.routes.accountRecovery} component={AccountRecovery} />
            <Route path={constants.routes.dash} component={MainActivity} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
