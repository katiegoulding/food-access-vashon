import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

export default class LogInActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pw: "",
            role: "",
            errorMessage: undefined
        }
    }

    componentDidMount() {
        //listen for auth change
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push(constants.routes.dash.base)
            }
        });
    }

    componentWillUnmount() {
        this.authUnsub();
    }

    handleSignIn(evt) {
        evt.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pw)
            .catch(err => this.setState({
                errorMessage: err.message
            }));
    }

    render() {
        return (
            <div>
                <div className="m-auto card">
                    <div className="card-body p-5 text-center">
                        {this.state.errorMessage ?
                            <div className="alert alert-danger">
                                {this.state.errorMessage}
                            </div> :
                            undefined
                        }
                        <h1 className="mb-3">FAPMIN</h1>
                        <form onSubmit={evt => this.handleSignIn(evt)}>
                            <div className="form-group">
                                <input id="email" className="form-control"
                                    type="email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onInput={evt => this.setState({ email: evt.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input id="pw" className="form-control"
                                    placeholder="Password"
                                    type="password"
                                    value={this.state.pw}
                                    onInput={evt => this.setState({ pw: evt.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary w-100">Sign In</button>
                            </div>
                        </form>
                    </div>
                </div>
                <p><Link to={constants.routes.accountRecovery}>Forgot password?</Link></p>
                <p>Don't yet have an account? <Link to={constants.routes.createAccount}>Sign Up!</Link></p>
            </div >
        )
    }
}