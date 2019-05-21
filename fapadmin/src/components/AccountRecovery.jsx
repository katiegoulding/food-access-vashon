import React from "react";
import firebase from 'firebase/app'
import { Form, Button, Grid, Responsive, Message } from 'semantic-ui-react';
import "firebase/auth";
import "firebase/database";

export default class AccountRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMessage: false,
      successMessage: undefined
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

  handlePasswordReset(evt) {
    let auth = firebase.auth();
    this.setState({ errorMessage: undefined });
    auth
      .sendPasswordResetEmail(this.state.email)
      .then( this.setState({
        successMessage: true,
        email: ""
      }) )
      .catch(err => this.setState({
        errorMessage: err.message 
      }));
  }

  handleOnUpdate = (e, { width }) => this.setState({ width })

    render() {
      const { width, successMessage, email } = this.state
      const colWidth = width >= Responsive.onlyTablet.minWidth ? '6' : '12'

      return (
        <Responsive as={Grid} fireOnMount onUpdate={this.handleOnUpdate} centered="true" middle columns={1}>
          <Grid.Column width={colWidth} verticalAlign="middle" textAlign="left">
            
            <Message
              attached='top'
              header="Account Recovery"
              content="Enter your account email to reset your password."
            />
            
            <Form 
              className="attached fluid segment"
              onSubmit={evt => this.handlePasswordReset(evt)}
              warning={successMessage}>
                
                <Form.Input
                  required
                  id="email"
                  label='Email'
                  type="email"
                  placeholder="Enter your email address"
                  value={this.state.email}
                  onInput={evt => this.setState({ email: evt.target.value })}
                />

                <Button type="submit" content='Reset'/>

                <Message
                  warning
                  header={"Thank you"}
                  content={"If that account exists in our system, password reset steps will be sent"}
                />

            </Form>
          </Grid.Column>
        </Responsive>
        )
    }
}
