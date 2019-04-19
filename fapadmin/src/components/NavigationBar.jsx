import React from 'react'
import { Link } from "react-router-dom";


export default class NavigationBar extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {
        // const { user } = this.props
        // examine the credentials and display the appropriate information
        // let tier = user.tier
        // const { tier } = user
        // https://firebase.google.com/docs/auth/admin/custom-claims
        return (
            <div>
                <Link to={"/dash/ViewData"} className="navButton"> View Data </Link>
                <Link to={"/dash/CreateBucks"} className="navButton"> Create Bucks </Link>
                <Link to={"/dash/ManageAcounts"} className="navButton"> Manage Accounts </Link>
                <Link to={"/dash/Scan"} className="navButton"> Scan </Link>
            </div>
        )
    }
}