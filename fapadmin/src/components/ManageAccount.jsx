import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import AccountList from './AccountList'

export default class ManageAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            filter: "",
            name: "",
            org: "",
            role: "",
            date_added: "",
            errorMessage: undefined
        }

        this.handleChange = this.handleChange.bind(this);
    }

    // componentDidMount() {
    //     this.authUnsub = firebase.auth().onAuthStateChanged(user => {
    //         this.setState({
    //             currentUser: user, 
    //         });            
    //         // if(this.state.currentUser === null) {
    //         //     this.props.history.push(constants.routes.base);
    //         // }
    //     });  
    // }

    // componentWillUnmount() {
    //     this.authUnsub();
    // }

    handleChange(evt) {
        this.setState({ value: evt.target.value });
    }

    render() {

        let accountRef = firebase.database().ref('/users/');

        return (

            <div>
                <h1>Manage Accounts</h1>
                <p>Arrange by: </p>
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="name">Name</option>
                    <option value="org">Organization</option>
                    <option value="role">Role</option>
                    <option value="date_added">Date Added</option>
                </select>

                <AccountList accountRef={accountRef} />
            </div >
        )
    }
}