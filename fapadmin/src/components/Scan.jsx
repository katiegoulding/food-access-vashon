import React from "react";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import QrReader from 'react-qr-reader'


export default class Scan extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            result: 'No result',
            legacyMode: false,
        }
    }

    handleScan = data => {

        if (data) {
            
            // TODO: make sure that we have an id in the data var
            let voucherRef = firebase.database().ref('vouchers/' + data)
            let userRef = firebase.database().ref('users/' + this.props.userId)

            console.log("this is the uid passed from props", this.props.userId)
            console.log("this is the role passed from props", this.props.role)

            if(this.props.role == "farmer") {
                // TODO: fill in the corresponding data visualization object with a new scan
                
                // if they are a farmer, fill in the "whenRedeemed" field on voucher object to the current time
                let redeemedOnRef = firebase.database().ref('vouchers/' + data + "/redeemedOn")
                redeemedOnRef.on('value', function(snapshot) {
                    if(snapshot.val() == "") {
                        console.log("this voucher has not been redeemed before")
                        voucherRef.update({
                            redeemedOn: new String(new Date())
                        })
                    } else {
                        console.log("this voucher has already been redeemed")
                    }
                });

                // also add the voucher id to the user's list of associated ids
                userRef.child("vouchersList").update({
                    [data]: "true"
                })

            } else if(this.props.role == "caseworker") {
                // TODO: fill in the corresponding data visualization object with a new scan

                // if they are a caseworker, fill in the "handedOutOn" field on voucher object to the current time
                let handedOutRef = firebase.database().ref('vouchers/' + data + "/handedOutOn")
                handedOutRef.on('value', function(snapshot) {
                    if(snapshot.val() == "") {
                        console.log("this voucher has not been handed out before")
                        voucherRef.update({
                            handedOutOn: new String(new Date())
                        })
                    } else {
                        console.log("this voucher has already been handed out")
                    }
                });

                // also add the voucher id to the user's list of associated ids
                userRef.child("vouchersList").update({
                    [data]: "true"
                })

            } else { // not caseworker or farmer
                // if they are an admin we could give them an informational message about the voucher? not required.
                // just give an informational message?
                // OR don't do anything? 

            }
            
            // Make a call to a google cloud function
            // URL TO relevant info
            // GCF will take 

            this.setState({
                result: data,
            })
        }
    }

    handleError = (err) => {
        console.error(err)
        this.setState({
            legacyMode: true
        })
    }

    render() {
        let scanner;

        if (this.state.legacyMode) {
            scanner = <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '20%', margin: 'auto' }}
                legacyMode
            />
        } else {
            scanner = <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '20%', margin: 'auto' }}
            />
        }


        return (
            <div>
                <h1>SCAN SCAN SCAN</h1>
                <div>
                    {scanner}
                    <p>Results: {this.state.result}</p>
                </div>
            </div >
        );
    }
}