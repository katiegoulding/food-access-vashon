import React from "react";
import firebase from 'firebase/app'
import { Form, Button } from 'semantic-ui-react';
import "firebase/auth";
import "firebase/database";

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

    render() {
      return (
        <Form onSubmit={evt => this.handlePasswordReset(evt)}>
        <h1>Reset Password</h1> 
          <Form.Input
            required
            id="email"
            label='Email'
            type="email"
            placeholder="Enter your email address"
            value={this.state.email}
            onInput={evt => this.setState({email: evt.target.value})}
          />
          <Button type="submit" content='reset'/>
        </Form>
        )
    }
}
