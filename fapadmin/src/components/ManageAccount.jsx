import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import AccountList from "./AccountList";
import { Header, Container, Grid, Segment } from "semantic-ui-react";

export default class ManageAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      filter: "",
      name: "",
      org: "",
      role: "",
      date_added: "",
      errorMessage: undefined
    };

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        currentUser: user
      });
      if (this.state.currentUser === null) {
        this.props.history.push(constants.routes.base);
      }
    });
  }

  componentWillUnmount() {
    this.authUnsub();
  }

  handleChange(evt) {
    this.setState({ value: evt.target.value });
  }

  render() {
    let accountRef = firebase.database().ref("/users/");

    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment
              style={{
                "padding-top": "30px",
                "padding-right": "40px",
                "padding-left": "40px"
              }}
              raised
            >
              <Container>
                <AccountList accountRef={accountRef} />
              </Container>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
