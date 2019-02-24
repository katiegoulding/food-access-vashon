import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";

export default class LogInActivity extends React.Component {

    render() {
        return (
            <div>
                <h1>LOGIN</h1>
                <Link to={constants.routes.dash}>
                    Submit
                </Link>
            </div >
        )
    }
}