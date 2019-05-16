import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import QrReader from "react-qr-reader";
import { Container, Segment, Message } from "semantic-ui-react";
export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "No result",
      legacyMode: false,
      invalidScan: false
    };
  }

  isValid(str) {
    return /[^.#$[\]]/.test(str);
  }

  handleScan = data => {
    console.log(this.props.userId);

    if (data) {
      // TODO: fill in the corresponding data visualization object with a new scan
      console.log(data);
      if (this.isValid(data)) {
        firebase
          .database()
          .ref("vouchers/")
          .child(data)
          .once("value", snapshot => {
            if (snapshot.exists()) {
              console.log("This ID exists.");
              console.log(this.props.userId);
              let voucherRef = firebase.database().ref("vouchers/" + data);

              let userRef = firebase
                .database()
                .ref("users/" + this.props.userId);

              let vizRef = firebase
                .database()
                .ref()
                .child("vis1/" + this.props.userId);

              var redeemDate = new Date();

              console.log(
                "this is the uid passed from props",
                this.props.userId
              );
              console.log(
                "this is the role passed from props",
                this.props.role
              );

              // TODO: THIS IS CASE SENSITIVE
              if (this.props.role === "farmer") {
                // TODO: fill in the corresponding data visualization object with a new scan
                console.log("I am in the farmer scan section");
                // if they are a farmer, fill in the "redeemedOn" field on voucher object to the current time
                let redeemedOnRef = firebase
                  .database()
                  .ref("vouchers/" + data + "/redeemedOn");

                redeemedOnRef.on("value", function(snapshot) {
                  console.log("snapshot.val() : ", snapshot.val());
                  if (!snapshot.val()) {
                    //if it is null there is no entry for redeemedOn
                    console.log("this voucher has not been redeemed before");
                    voucherRef.update({
                      redeemedOn: redeemDate
                    });
                  } else {
                    console.log("this voucher has already been redeemed");
                  }
                });

                // also add the voucher id to the user's list of associated ids
                userRef.child("vouchersList").update({
                  [data]: "true"
                });

                // add to vis1 list (MAYBE CHANGE LATER????)
                vizRef.update({
                  [data]: redeemDate
                });

                // add to vis2 list (MAYBE CHANGE LATER????)
                firebase
                  .database()
                  .ref("vouchers/" + data)
                  .once("value")
                  .then(function(snapshot) {
                    var org = snapshot.val().organization;
                    firebase
                      .database()
                      .ref()
                      .child("vis2/" + org + "/redeemed/")
                      .update({
                        [data]: redeemDate
                      });
                  });
              } else if (this.props.role === "caseworker") {
                // TODO: fill in the corresponding data visualization object with a new scan

                // if they are a caseworker, fill in the "handedOutOn" field on voucher object to the current time
                let handedOutRef = firebase
                  .database()
                  .ref("vouchers/" + data + "/handedOutOn");
                handedOutRef.on("value", function(snapshot) {
                  if (!snapshot.val()) {
                    //if it is null there is no entry for handedOutOn
                    console.log("this voucher has not been handed out before");
                    voucherRef.update({
                      handedOutOn: new Date()
                    });
                  } else {
                    console.log("this voucher has already been handed out");
                  }
                });

                firebase
                  .database()
                  .ref("vouchers/" + data)
                  .once("value")
                  .then(function(snapshot) {
                    var org = snapshot.val().organization;
                    firebase
                      .database()
                      .ref()
                      .child("vis2/" + org + "/handedOut/")
                      .update({
                        [data]: redeemDate
                      });
                  });

                // also add the voucher id to the user's list of associated ids
                userRef.child("vouchersList").update({
                  [data]: "true"
                });
              } else {
                // not caseworker or farmer
                // if they are an admin we could give them an informational message about the voucher? not required.
                // just give an informational message?
                // OR don't do anything?
                console.log(
                  "you're currently an admin which does not support scanning"
                );
              }
              this.setState({
                invalidScan: false
              });
            } else {
              console.log("This ID doesn't exist.");
              this.setState({
                invalidScan: true
              });
            }
          });
      } else {
        console.log("bad path");
        this.setState({
          invalidScan: true
        });
      }

      // Make a call to a google cloud function
      // URL TO relevant info
      // GCF will take

      this.setState({
        result: data
      });
    }
  };

  handleError = err => {
    console.error(err);
    this.setState({
      legacyMode: true
    });
  };

  render() {
    let scanner;

    if (this.state.legacyMode) {
      scanner = (
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "50%", margin: "auto" }}
          legacyMode
        />
      );
    } else {
      scanner = (
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "50%", margin: "auto" }}
        />
      );
    }

    return (
      <Container>
        <Segment
          style={{
            paddingTop: "30px",
            paddingRight: "40px",
            paddingLeft: "40px"
          }}
          raised
        >
          {this.state.invalidScan ? (
            <Message warning>
              <Message.Header>Invalid Scan!</Message.Header>
              <p>Make sure you have a valid coupon, then try again.</p>
            </Message>
          ) : null}
          <Container>
            {scanner}
            <p>Results: {this.state.result}</p>
          </Container>
        </Segment>
      </Container>
    );
  }
}
