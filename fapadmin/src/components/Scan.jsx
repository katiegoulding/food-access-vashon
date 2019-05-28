import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import QrReader from "react-qr-reader";
import { Segment, Message, Header, Container } from "semantic-ui-react";
export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "No result",
      legacyMode: false,
      invalidScan: false,
      scanState: "",
      qrCode: ''
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    const priorQRCode = prevState.result.id
    const curQRCode = this.state.result.id
    if (priorQRCode !== curQRCode) {
      setTimeout(
        () => {
          this.setState({
            loading: false
          })
        }, 5000
      )
    }
  }

  // Checks that the data is a valid string
  // AKA: handles if a non-VIGA QR code is scanned
  isValid(str) {
    return /[^.#$[\]]/.test(str);
  }

  handleScan = data => {
    if (data) {
      // There is some data on the QR code
      console.log("data ", data)
      this.setState({
        loading: true
      })
      if (this.isValid(data)) {
        firebase.database().ref("vouchers/").child(data).once("value", snapshot => {
            if (snapshot.exists()) {
              console.log("This ID exists.");
              //The data is an id that we created
              this.populateUserData(data) 
              this.populateVisData(data)
            } else {
              // the snapshot does not exist
              // logically, this buck has been deleted or is not a real buck 
              this.setState({scanState: "scanError"})
            }
        }).catch(
          err => {
            console.log('Firebase voucher lookup err:', err)
          }
        );
      } else {
        console.log("bad path");
        this.setState({
          invalidScan: true,
          scanState: "scanError"
        });
      }
      this.setState({
        result: data
      });
    }
  };

  populateVisData = (data) => {
    console.log("In the populate data branch")
    var redeemDate = new Date();
    let vizRef = firebase.database().ref().child("vis1/" + this.props.userId);

    if(this.props.role === "farmer") {
      vizRef.update({
        [data]: redeemDate
      });

      firebase.database().ref("vouchers/" + data).once("value")
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
      firebase.database().ref("vouchers/" + data).once("value")
      .then(function(snapshot) {
        var org = snapshot.val().organization;
        firebase.database().ref().child("vis2/" + org + "/handedOut/").update({
          [data]: redeemDate
        });
      });
    } 
  }

  // If expired, farmers are still permitted to scan. If expired, caseworkers are not.
  populateUserData = (data) => {
    let scanState = ""
    let voucherRef = firebase.database().ref("vouchers/" + data);

    let userRef = firebase.database().ref("users/" + this.props.userId);

    if (this.props.role === "farmer") {
      // if they are a farmer, fill in the "redeemedOn" field on voucher object to the current time
      let redeemedOnRef = firebase.database().ref("vouchers/" + data + "/redeemedOn");

      redeemedOnRef.once("value", (snapshot) => {
        if (!snapshot.val()) {
          //if it is null, there is no entry for redeemedOn, the voucher hasn't yet been redeemed
          let redeemDate = new Date();
 
          // this is necessary to get the expiration date
          voucherRef.once("value", (snapshot) => {
            let expirationDate = new Date(snapshot.val().expirationDate)
            if(redeemDate.getTime() <= expirationDate.getTime()) {
              //not expired - success: add to database
              voucherRef.update({
                redeemedOn: redeemDate
              });
              // add the voucher id to the user's list of associated ids
              userRef.child("vouchersList").update({
                [data]: "notPaid"
              });
              console.log("in the success statement")
              scanState = "success"
            } else {
              //expired - calls for farmer to redeem in person
              console.log("in the expired statement")
              scanState = "expiredFarmer"
            }
          })

        } else {
          console.log('.val() already exists, setting state to already redeemed')
          //if it is not null, the voucher has already been redeemed
          scanState = "alreadyRedeemed"
        }
        this.setState({scanState})
      });
    } else if (this.props.role === "caseworker") {
      // if they are a caseworker, fill in the "handedOutOn" field on voucher object to the current time
      let handedOutRef = firebase.database().ref("vouchers/" + data + "/handedOutOn");

      handedOutRef.once("value", (snapshot) => {
        if (!snapshot.val()) {
          //if it is null there is no entry for handedOutOn, the voucher hasn't yet been handed out
          let handedOutDate = new Date();

          // this is necessary to get the expiration date
          voucherRef.once("value", (snapshot) => {
            let expirationDate = new Date(snapshot.val().expirationDate)
            if(handedOutDate.getTime() <= expirationDate.getTime()) {
              //the voucher is not expired, success: add to database
              voucherRef.update({
                handedOutOn: handedOutDate
              });
              userRef.child("vouchersList").update({
                [data]: "true"
              });
              console.log("in the success statement")
              scanState = "success"
            } else {
              //the voucher is expired, do not add to database
              console.log("in the expired statement")
              scanState = "expiredCaseworker"
            }
          })

        } else {
          // if it is not null, the voucher has already been redeemed
          // caseworkers may still hand out vouchers that have been handed out before
          // just without scanning them
          scanState = "alreadyHanded"
        }
        this.setState({scanState})
      });
    } else {
      // not caseworker or farmer -> account does not support scanning
      this.setState({
        scanState: "accountIssue"
      })
    }
  }

  handleError = err => {
    console.error(err);
    this.setState({
      legacyMode: true
    });
  };

  render() {
    let scanner;
    const { scanState } = this.state

    if (this.state.legacyMode) {
      scanner = (
        <QrReader
          delay={3000}
          onError={this.handleError}
          onScan={this.handleScan}
          legacyMode
        />
      );
    } else {
      scanner = (
        <QrReader
          delay={3000}
          onError={this.handleError}
          onScan={this.handleScan}
        />
      );
    }

    return (
      <div>
        <Segment attached='top'>
            {scanner}
        </Segment>

        {(() => {
          switch(scanState) {
            case 'success':
            return <Message
                      positive
                      attached='bottom'
                      icon='thumbs up'
                      header='Success!'
                      content='This buck has been submitted! Feel free to recycle or keep for your records.'
                    />;
            case 'expiredFarmer':
              return <Message
                        warning
                        attached='bottom'
                        icon='calendar times outline'
                        header='Expired'
                        content='You may still receive compensation, please submit to a FAP organizer in person.'
                      />;
            case 'alreadyRedeemed':
              return <Message
                        negative
                        attached='bottom'
                        icon='x'
                        header='Previously Submitted'
                        content='This buck has already been submitted.'
                      />;
            case 'scanError':
              return <Message
                        warning
                        attached='bottom'
                        icon='frown'
                        header='Error scanning'
                        content='Make sure you have a valid buck, then try again.'
                      />;
            case 'alreadyHanded':
              return <Message
                        negative
                        attached='bottom'
                        icon='x'
                        header='Previously handed out'
                        content='This buck has been "handed out" before, no need to scan again.'
                      />;
            case 'accountIssue': 
              return <Message
                        warning
                        attached='bottom'
                        icon='!'
                        header='Error'
                        content='Your account does not support scanning.'
                      />;
            case 'expiredCaseworker':
              return <Message
                          warning
                          attached='bottom'
                          icon='calendar times outline'
                          header='This buck is expired'
                          content='Please recycle this VIGA farm buck.'
                        />;
            default:
              console.log('an unknown error has occurred')
              return <div></div>;
          }
        })()}
        <Segment basic>
          <Header as="h2">How to Scan</Header>
          <p>
            1. Make sure to allow this site to use your camera for scanning.
          </p>
          <p>
            2. Have your Farm Buck(s) in hand and center QR code in the camera view.
          </p>
          <p>
            3. You'll see a message informing you the scan is successful!
          </p>
        </Segment>
      </div>
    );
  }
}
