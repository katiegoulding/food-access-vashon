import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

export default class AccountRecovery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pw: "",
            errorMessage: undefined
        }
    }

    render() {
        return (
            <div>
                <h1>Reset Password</h1> 
            </div >
        )
    }
}