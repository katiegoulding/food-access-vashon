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
            <Link to={constants.routes.dash.bucksLanding} className="navButton"> Create Bux </Link>,
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

        let divStyle = {
            paddingBottom: "20px"
        }

        return (
            <div>
                {ui}
            </div>
        )
    }
}