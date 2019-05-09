import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Message, Form, Button, Icon, Grid } from "semantic-ui-react";

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      role: "farmer",
      org: "foodbank",
      email: "",
      pw: "",
      pw_confirm: "",
      errorMessage: undefined
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

  handleCreateAccount(evt) {
    evt.preventDefault();

    this.setState({
      loading: true
    });

    if (this.state.pw !== this.state.pw_confirm) {
      this.setState({
        errorMessage: "Passwords do not match",
        loading: false
      });
    } else if (this.state.displayName === "") {
      this.setState({
        errorMessage: "Enter Display Name",
        loading: false
      });
      return;
    } else if (this.state.pw.length < 6) {
      this.setState({
        errorMessage: "Password must be at least six characters",
        loading: false
      });
      return;
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.pw)
        .then(async Response => {
          try {
            this.setState({
              loading: true,
              errorMessage: ""
            });
            return firebase
              .database()
              .ref(`/users/${Response.user.uid}`)
              .set({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: Response.user.email,
                role: this.state.role,
                org: this.state.org,
                approved: false
              });
          } catch (err) {
            return this.setState({
              loading: false,
              errorMessage: err.message
            });
          }
        })
        .catch(err =>
          this.setState({
            loading: false,
            errorMessage: err.message
          })
        );
    }
  }

  render() {
    const roleOptions = [
      { key: "f", text: "Farmer", value: "farmer" },
      { key: "c", text: "Caseworker", value: "caseworker" },
      { key: "a", text: "Admin", value: "admin" }
    ];

    const orgOptions = [
      { key: "f", text: "Food Bank", value: "foodbank" },
      { key: "d", text: "DoVE", value: "dove" },
      { key: "c", text: "Vashon Community Care", value: "vcc" },
      { key: "s", text: "Senior Center", value: "seniorcenter" },
      {
        key: "i",
        text: "Interfaith Council to Prevent Homelessness",
        value: "interfaith"
      },
      { key: "h", text: "Vashon Household", value: "vashonhousehold" },
      { key: "l", text: "La Comunidad", value: "lacomunidad" },
      { key: "y", text: "Vashon Youth and Family Services", value: "vyfs" }
    ];

    const { loading, errorMessage } = this.state;

    return (
      <Grid centered columns={1}>
        <Grid.Column width={10} verticalAlign="middle" textAlign="left">
          <Message
            attached
            header="Create an Account"
            content="Provide some basic information to get started!"
          />

          <Form
            className="attached fluid segment"
            onSubmit={evt => this.handleCreateAccount(evt)}
            error={errorMessage}
            loading={loading}
          >
            <Message
              error
              header={"Account not created"}
              content={errorMessage}
            />

            <Form.Input
              required
              label="First Name"
              htmlFor="firstName"
              id="firstName"
              type="text"
              className="form-control"
              value={this.state.firstName}
              onInput={evt => this.setState({ firstName: evt.target.value })}
            />

            <Form.Input
              required
              label="Last Name"
              htmlFor="lastName"
              id="lastName"
              type="text"
              className="form-control"
              value={this.state.lastName}
              onInput={evt => this.setState({ lastName: evt.target.value })}
            />

            <Form.Select
              required
              label="Role"
              htmlFor="role"
              value={this.state.role}
              options={roleOptions}
              onChange={evt => this.setState({ role: evt.target.value })}
            />

            <Form.Select
              label="Affiliated Organization:"
              htmlFor="organization"
              value={this.state.org}
              options={orgOptions}
              onChange={evt => this.setState({ org: evt.target.value })}
            />

            <Form.Input
              required
              id="email"
              htmlFor="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={this.state.email}
              onInput={evt => this.setState({ email: evt.target.value })}
            />

            <Form.Input
              required
              id="pw"
              htmlFor="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={this.state.pw}
              onInput={evt => this.setState({ pw: evt.target.value })}
            />

            <Form.Input
              required
              id="pw_confrim"
              htmlFor="passwordConfirm"
              label="Reenter Password"
              type="password"
              placeholder="confirm your password"
              value={this.state.pw_confirm}
              onInput={evt => this.setState({ pw_confirm: evt.target.value })}
            />

            <Button type="submit">Create Account</Button>
          </Form>
          <Message attached="bottom" info>
            <Icon name="help" />
            Already have an account? &nbsp;
            <Link to={constants.routes.base}>Sign in!</Link>&nbsp;
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
