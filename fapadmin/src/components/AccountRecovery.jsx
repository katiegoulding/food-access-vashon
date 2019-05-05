import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import ManageAccount from "./ManageAccount";

export default class AccountRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMessage: undefined
    };
  }

  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        currentUser: user
      });
      // if(this.state.currentUser === null) {
      //     this.props.history.push(constants.routes.base);
      // }
    });
  }

  componentWillUnmount() {
    this.authUnsub();
  }

  handlePasswordReset(email) {
    let auth = firebase.auth();
    console.log("before");
    this.setState({ errorMessage: undefined });
    auth
      .sendPasswordResetEmail(email)
      .then(function() {})
      .catch(err => this.setState({ errorMessage: err.message }));
    console.log("after");
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <ManageAccount />
        <h1>Reset Password</h1>
        <form onSubmit={evt => this.handlePasswordReset(evt)}>
          <div className="col-md-4 mx-auto">
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={this.state.email}
              //onChange = {this.onChange}
              onInput={evt => this.setState({ email: evt.target.value })}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-default">
              Reset
            </button>
          </div>
        </form>
      </div>
    );
  }
}
