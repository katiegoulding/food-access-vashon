import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

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
    if (this.state.pw !== this.state.pw_confirm) {
      this.setState({ errorMessage: "Passwords do not match" });
    } else if (this.state.displayName === "") {
      this.setState({
        errorMessage: "Enter Display Name"
      });
      return;
    } else if (this.state.pw.length < 6) {
      this.setState({
        errorMessage: "Password must be at least six characters"
      });
      return;
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.pw)
        .then(async Response => {
          try {
            return firebase
              .database()
              .ref(`/users/${Response.user.uid}`)
              .set({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: Response.user.email,
                role: this.state.role,
                org: this.state.org
              });
          } catch (err) {
            return this.setState({
              errorMessage: err.message
            });
          }
        })
        .catch(err =>
          this.setState({
            errorMessage: err.message
          })
        );
    }
  }

  render() {
    return (
      <div className="container">
        {this.state.errorMessage ? (
          <div className="alert alert-danger">{this.state.errorMessage}</div>
        ) : (
          undefined
        )}
        <h1>Create Account</h1>
        <form onSubmit={evt => this.handleCreateAccount(evt)}>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="firstName">First Name: </label>
                <input
                  id="firstName"
                  type="text"
                  className="form-control"
                  value={this.state.firstName}
                  onInput={evt =>
                    this.setState({ firstName: evt.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="lastName">Last Name: </label>
                <input
                  id="lastName"
                  type="text"
                  className="form-control"
                  value={this.state.lastName}
                  onInput={evt => this.setState({ lastName: evt.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="role">Role: </label>
                <select
                  value={this.state.role}
                  onChange={evt => this.setState({ role: evt.target.value })}
                >
                  <option value="farmer">Farmer</option>
                  <option value="caseworker">Caseworker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="org">Affiliated Organization: </label>
                {/* <input
                                    id="org"
                                    type="text"
                                    className="form-control"
                                    value={this.state.org}
                                    onInput={evt => this.setState({ org: evt.target.value })}
                                /> */}
                <select
                  value={this.state.org}
                  onChange={evt => this.setState({ org: evt.target.value })}
                >
                  <option value="foodbank">Food Bank</option>
                  <option value="dove">DoVE</option>
                  <option value="vcc">Vashon Community Care</option>
                  <option value="seniorcenter">Senior Center</option>
                  <option value="interfaith">
                    Interfaith Council to Prevent Homelessness
                  </option>
                  <option value="vashonhousehold">Vashon Household</option>
                  <option value="lacomunidad">La Comunidad</option>
                  <option value="vyfs">Vashon Youth and Family Services</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="email">Email: </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={this.state.email}
                  onInput={evt => this.setState({ email: evt.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="password">
                  Password (minimum of 6 characters):{" "}
                </label>
                <input
                  id="pw"
                  type="password"
                  className="form-control"
                  placeholder="enter your password"
                  value={this.state.pw}
                  onInput={evt => this.setState({ pw: evt.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <label htmlFor="passwordConfirm">
                  Please re-enter your password:{" "}
                </label>
                <input
                  id="pw_confrim"
                  type="password"
                  className="form-control"
                  placeholder="confirm your password"
                  value={this.state.pw_confirm}
                  onInput={evt =>
                    this.setState({ pw_confirm: evt.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-default">
              Create Account
            </button>
          </div>
        </form>
        <p>
          Already have an account?{" "}
          <Link to={constants.routes.base}>Sign in</Link>
        </p>
      </div>
    );
  }
}
