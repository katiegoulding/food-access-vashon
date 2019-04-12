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

    handlePasswordReset(email) {
        this.setState({errorMessage: undefined});
        firebase.sendPasswordResetEmail(email).then(function() {
        
        }).catch(err => this.setState({errorMessage: err.message}));
    }

    render() {
        return (
            <div>
                <h1>Reset Password</h1> 
                <div className="col-md-4 mx-auto">  
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Enter your email address"
                        v={this.state.email}
                        onInput={evt => this.setState({email: evt.target.v})}
                    />
                    </div>
                <button className="btn btn-info m-1" onClick={() => this.handlePasswordReset(this.email) }>
                    <p>reset</p>
                </button>   
            </div >
        )
    }
}