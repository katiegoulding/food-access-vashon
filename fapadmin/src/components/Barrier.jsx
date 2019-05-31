import React from "react";
import firebase from "firebase/app";
import constants from "./constants";
import { Grid, Header, Icon, Segment } from "semantic-ui-react";
import "firebase/auth";
import "firebase/database";

export default class Barrier extends React.Component {
  componentDidMount() {
    this.authUnsub = firebase.auth().onIdTokenChanged(user => {
      if (user) {
        console.log("user = ", { user });
        user.getIdTokenResult(true).then(idTokenResult => {
          console.log("idTokenResult", idTokenResult.claims.role);
          if (idTokenResult.claims.role) {
            //push them on to the dashboard
            this.props.history.push(constants.routes.dash.base);
          }
        });
      } else {
        console.log("user not defined");
      }
    });
    // firebase.auth().onIdTokenChanged()
  }

  render() {
    return (
      <Grid centered="true">
        <Grid.Column width={8} verticalAlign="middle" textAlign="center">
          <Segment inverted color="olive" className="barrierContainer">
            <Icon name="hand paper outline" size="huge" />
            <Header
              inverted
              as="h1"
              content="Your account is pending approval."
            />
            <Header.Subheader>
              Once your account is approved this page will automatically update.
            </Header.Subheader>
            <p>
              Please contact foodaccesspartnership@vigavashon.org with account
              inquiries.
            </p>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
