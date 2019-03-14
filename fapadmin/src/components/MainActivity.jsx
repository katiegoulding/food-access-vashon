import React from "react";
import DataInput from "./DataInput";
import Dashboard from "./Dashboard"
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

export default class MainActivity extends React.Component {

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push(constants.routes.logIn)
            }
        });
    }

    handleSignOut() {
        firebase.auth().signOut()
            .then(this.props.history.push(constants.routes.logIn))
    };

    render() {
        return (
            <div>
                <h1>Main Screen</h1>
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