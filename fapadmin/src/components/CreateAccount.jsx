import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

export default class CreateAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: "",
            firstName: "",
            lastName: "",
            role: "",
            org: "",
            email: "",
            pw: "",
            pw_confirm: "",
            errorMessage: undefined
        }
    }
    
    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            this.setState({currentUser: user});
        });
    }

    componentWillUnmount() {
        this.authUnsub();
    }

    handleCreateAccount(evt) {
        evt.preventDefault();
        if(this.state.pw !== this.state.pw_confirm) {
            this.setState({errorMessage: "Passwords do not match"})
        } else {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pw)
                // .then(user => user.updateProfile({
                //     firstName: this.state.firstName,
                //     lastName: this.state.lastName,
                //     role: this.state.role,
                //     org: this.state.org,
                // }))
                // .catch(err => this.setState({errorMessage: err.message})
                // );
            
        // firebase.auth().onAuthStateChanged(user => {
        //     if(this.state.currentUser) {
        //         this.props.history.push(constants.routes.general);
        //     }
        // })
        };
    }

    render() {
        return(
            <div className="container">
                {
                    this.state.errorMessage ?
                    <div className="alert alert-danger">{this.state.errorMessage}</div> : undefined
                }
                <h1>Create Account</h1>
                <form onSubmit={evt => this.handleCreateAccount(evt)}>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">  
                                <label htmlFor="firstName">First Name: </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className="form-control"
                                    value={this.state.firstName}
                                    onInput={evt => this.setState({firstName: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">  
                                <label htmlFor="lastName">Last Name: </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className="form-control"
                                    value={this.state.lastName}
                                    onInput={evt => this.setState({lastName: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">                     
                            <label htmlFor="role">Role: </label>
                                <input
                                    id="role"
                                    type="select"
                                    className="form-control"
                                    value={this.state.role}
                                    onInput={evt => this.setState({role: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">                     
                            <label htmlFor="org">Affiliated Organization: </label>
                                <input
                                    id="org"
                                    type="text"
                                    className="form-control"
                                    value={this.state.org}
                                    onInput={evt => this.setState({org: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">  
                                <label htmlFor="email">Email: </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email address"
                                    value={this.state.email}
                                    onInput={evt => this.setState({email: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">
                                <label htmlFor="password">Password (minimum of 6 characters): </label>
                                <input 
                                    id="pw"
                                    type="password"
                                    className="form-control"
                                    placeholder="enter your password"
                                    value={this.state.pw}
                                    onInput={(evt) => this.setState({pw: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">
                                <label htmlFor="passwordConfirm">Please re-enter your password: </label>
                                <input 
                                    id="pw_confrim"
                                    type="password"
                                    className="form-control"
                                    placeholder="confirm your password"
                                    value={this.state.pw_confirm}
                                    onInput={(evt) => this.setState({pw_confirm: evt.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default">
                            Create Account
                        </button>
                    </div>
                </form>
                <p>Already have an account? <Link to={constants.routes.logIn}>Sign in</Link></p>

            </div>
        );
    }
}