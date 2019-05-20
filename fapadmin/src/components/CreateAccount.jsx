import React from "react";
import { Link } from "react-router-dom";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Message, Form, Button, Icon, Grid, Responsive } from "semantic-ui-react";

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      role: "",
      org: "",
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
        user.getIdTokenResult().then(idTokenResult => {
          console.log(idTokenResult.claims.role)
          if(idTokenResult.claims.role) {
              //push them on to the dashboard
              this.props.history.push(constants.routes.dash.base);
          } else {
              //push them to the barrier page
              this.props.history.push(constants.routes.barrier);
          }
        });
      }
    });
  }

  handleCreateAccount(evt) {
    evt.preventDefault();

    this.setState({
      loading: true
    });

    // handle case for bookkeeper and admin org
    if(this.state.role.toLowerCase() === 'admin' || this.state.role.toLowerCase() === 'bookkeeper') {
      this.setState({
        org: "fap"
      })
    }

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
      // auth.token.role == 'admin'
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.pw)
        .then(response => {
          try {
            this.setState({
              loading: true,
              errorMessage: ""
            });
            console.log('response = ', response)
            return firebase
              .database()
              .ref(`/users/${response.user.uid}`)
              .set({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                role: this.state.role,
                org: this.state.org,
                vouchersList: [], // added on 5/20 to avoid accessing undefined later
                approved: false  // TODO: Change this?
              });
          } catch (err) {
            console.log('err on write to db = ', err)
            return this.setState({
              loading: false,
              errorMessage: err.message
            });
          }
        })
        .catch(err => {
          console.log('err on write to db = ', err)
          this.setState({
            loading: false,
            errorMessage: err.message
          })
        }
      );
    }
  }

  handleOnUpdate = (e, { width }) => this.setState({ width })

  render() {
    const roleOptions = [
      { key: "f", text: "Farmer", value: "Farmer" },
      { key: "c", text: "Caseworker", value: "Caseworker" },
      { key: "a", text: "Admin", value: "Admin" },
      { key: "b", text: "Bookkeeper", value: "Bookkeeper"}
    ];

    const orgOptions = [
      { key: "f", text: "Food Bank", value: "Foodbank" },
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

    const { loading, errorMessage, role } = this.state;
    const { width } = this.state
    const colWidth = width >= Responsive.onlyTablet.minWidth ? '6' : '12'

    return (
      <Responsive as={Grid} fireOnMount onUpdate={this.handleOnUpdate} centered="true" middle columns={1}>
        <Grid.Column width={colWidth} verticalAlign="middle" textAlign="left">
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
              onChange={(evt, data) => {
                  this.setState({ role: data.value })
                }
              }
            />

            {(() => {
              switch(role) {
                case 'Caseworker':
                  return <Form.Select 
                            required 
                            label="Affiliated Organization:" 
                            htmlFor="organization" 
                            value={this.state.org} 
                            options={orgOptions} 
                            onChange={(evt, data) => { 
                                this.setState({ org: data.value }) 
                              }
                            } 
                          />;
                case 'Farmer':
                  return <Form.Input 
                            required
                            label="Farm Name:" 
                            htmlFor="organization" 
                            value={this.state.org} 
                            onInput={evt => this.setState({ org: evt.target.value })}
                          />;
                case 'Admin':
                  return <Form.Input 
                          label='Affiliated Organization:'
                          htmlFor="organization"  
                          value={"Food Access Partnership"} 
                          placeholder='Food Access Partnership' 
                          readOnly 
                        />;
                case 'Bookkeeper':
                return <Form.Input 
                        label='Affiliated Organization:'
                        htmlFor="organization"  
                        value={"Food Access Partnership"} 
                        placeholder='Food Access Partnership' 
                        readOnly 
                      />;
                default:
                  return <div></div>;
              }
            })()}

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
      </Responsive>
    );
  }
}
