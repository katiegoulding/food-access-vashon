import React from "react";
import DataInput from "./DataInput";
import Dashboard from "./Dashboard"
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import QrReader from 'react-qr-reader'

export default class MainActivity extends React.Component {


    constructor(props) { 
        super(props)
        this.state = {
            result: 'No result',
            legacyMode: false,
            user: undefined
        }
    }

    componentDidMount() {
        // Does this need to get saved as a variable ?
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push(constants.routes.logIn)
            } else {
                this.setState({
                    user
                })
            }
        });
    }

    handleScan = (data) => {
        if (data) {
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

    handleSignOut() {
        firebase.auth().signOut()
            .then(this.props.history.push(constants.routes.logIn))
    };

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
                <h1>Main Screen</h1>
                <div>
                    {scanner}
                    <p>Results: {this.state.result}</p>
                </div>

                <DataInput />
                <Dashboard />
                <button
                    type="submit"
                    className="btn btn-danger col-1"
                    onClick={() => this.handleSignOut()}>
                    Sign Out
                </button>
            </div >
        );
    }
}