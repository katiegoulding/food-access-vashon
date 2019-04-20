import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

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

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            this.setState({
                currentUser: user, 
            });            
            // if(this.state.currentUser === null) {
            //     this.props.history.push(constants.routes.base);
            // }
        });  
    }

    componentWillUnmount() {
        this.authUnsub();
    }
    
    handleChange(evt) {
        this.setState({value: evt.target.value});
    }

    render() {
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
            
                <table align="center">
                    <tr>
                        <th>Name</th>
                        <th>Organization</th> 
                        <th>Role</th>
                        <th>Date Added</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Rob</td>
                        <td>Rob's Farm</td> 
                        <td>Farmer</td>
                        <td>04/13/2019</td>
                        <td><Link to={constants.routes.editaccount}> edit </Link></td>
                    </tr>
                    <tr>
                        <td>Amanda</td>
                        <td>Plum Forest</td> 
                        <td>Farmer</td>
                        <td>04/12/2019</td>
                        <td><Link to={constants.routes.editaccount}> edit </Link></td>
                    </tr>
                    <tr>
                        <td>Juniper</td>
                        <td>FAP</td> 
                        <td>Admin</td>
                        <td>04/10/2019</td>
                        <td><Link to={constants.routes.editaccount}> edit </Link></td>
                    </tr>
                    <tr>
                        <td>Heidi</td>
                        <td>DOVE</td> 
                        <td>Caseworker</td>
                        <td>04/10/2019</td>
                        <td><Link to={constants.routes.editaccount}> edit </Link></td>
                    </tr>
                </table>
            </div >
        )
    }
}