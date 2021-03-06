import React, { Component } from "react";
import "./App.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import constants from "./components/constants";
import "firebase/auth";
import "firebase/database";
import LogInActivity from "./components/LogInActivity.jsx";
import CreateAccount from "./components/CreateAccount.jsx";
import AccountRecovery from "./components/AccountRecovery.jsx";
import MainView from "./components/MainView";
import Barrier from "./components/Barrier.jsx";

class App extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     user: undefined
  //   }
  // }

  // componentDidMount() {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (!user) {
  //       this.props.history.push(constants.routes.base)
  //     } else {
  //       this.setState({
  //         user
  //       })
  //     }
  //   });
  // }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              exact
              path={constants.routes.base}
              component={LogInActivity}
            />
            {/* {this.state.user && <Route path={constants.routes.base} component={MainView} />} */}
            <Route path={constants.routes.dash.base} component={MainView} />
            <Route
              path={constants.routes.createAccount}
              component={CreateAccount}
            />
            <Route
              path={constants.routes.accountRecovery}
              component={AccountRecovery}
            />
            <Route path={constants.routes.barrier} component={Barrier} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
