import React, { Component } from 'react';

//import logo from './logo.svg';
import './App.css';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import constants from "./components/constants";

import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import LogInActivity from "./components/LogInActivity.jsx";
import MainView from './components/MainView';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      user: undefined
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
          this.props.history.push(constants.routes.logIn)
      } else {
          this.setState({
              user
          })
      }
  });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            {/* want to show navbar if they're logged in */}
            <Route exact path={constants.routes.base} component={LogInActivity} />
            {this.state.user && <Route path={constants.routes.base} component={MainView} />}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
