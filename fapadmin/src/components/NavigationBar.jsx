import React from 'react'
import { Link } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app';
import 'firebase/auth';


export default class NavigationBar extends React.Component {

    render() {
        let farmerUI = [];
        let cworkerUI = [
            <Link to={constants.routes.dash.base} className="navButton"> Scan </Link>,
            <Link to={constants.routes.dash.viewData} className="navButton"> View Data </Link>
        ];
        let adminUI = [
            <Link to={constants.routes.dash.viewData} className="navButton"> View Data </Link>,
            <Link to={"/dash/CreateBux"} className="navButton"> Create Bux </Link>,
            <Link to={constants.routes.dash.manageAccount} className="navButton"> Manage Accounts </Link>,
            <Link to={constants.routes.dash.base} className="navButton"> Scan </Link>
        ];

        let ui;

        if (this.props.role === 'admin') {
            ui = adminUI;
        } else if (this.props.role === 'caseworker') {
            ui = cworkerUI;
        } else {
            ui = farmerUI;
        }


        // const { user } = this.props
        // examine the credentials and display the appropriate information
        // let tier = user.tier
        // const { tier } = user
        // https://firebase.google.com/docs/auth/admin/custom-claims
        return (
            <div>
                {ui}
            </div>
        )
    }
}