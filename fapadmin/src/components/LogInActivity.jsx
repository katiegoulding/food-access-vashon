import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Message, Form, Button, Icon, Grid, Divider } from "semantic-ui-react";

export default class LogInActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pw: "",
      role: "",
      errorMessage: undefined,
      loading: false
    };
  }

  componentDidMount() {
    //listen for auth change
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push(constants.routes.dash.base);
      }
    });
  }

  componentWillUnmount() {
    this.authUnsub();
  }

  handleSignIn(evt) {
    evt.preventDefault();

    this.setState({
      loading: true
    });

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.pw)
      .catch(err =>
        this.setState({
          errorMessage: err.message,
          loading: false
        })
      );
  }

  render() {
    const { loading, errorMessage } = this.state;

    return (
      <Grid centered columns={1}>
        <Grid.Column width={6}>
          <Message
            attached
            header="Welcome to our site!"
            content="Sign in to access your account"
          />
          <Form
            className="attached fluid segment"
            onSubmit={evt => this.handleSignIn(evt)}
            error={errorMessage}
            loading={loading}
          >
            <Message error header={errorMessage} content={"not logged in"} />

            <Form.Input
              required
              id="email"
              label="Email"
              placeholder="Email"
              type="email"
              value={this.state.email}
              onInput={evt => this.setState({ email: evt.target.value })}
            />

            <Form.Input
              required
              id="pw"
              label="Password"
              placeholder="Password"
              type="password"
              value={this.state.pw}
              onInput={evt => this.setState({ pw: evt.target.value })}
            />

            <Button type="submit">Sign In</Button>
            <Divider hidden />
            <Link to={constants.routes.accountRecovery}>Forgot password?</Link>
          </Form>
          <Message attached="bottom" info>
            <Icon name="help" />
            Don't have an account? &nbsp;
            <Link to={constants.routes.createAccount}>Sign Up</Link>
            &nbsp;instead.
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
