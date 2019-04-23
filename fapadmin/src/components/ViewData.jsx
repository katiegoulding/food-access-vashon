import React from 'react'
import Dashboard from './Dashboard';

export default class ViewData extends React.Component {


    render() {
        // const { user } = this.props
        // examine the credentials and display the appropriate information
        // let tier = user.tier
        // const { tier } = user
        // https://firebase.google.com/docs/auth/admin/custom-claims
        return (
            <div>
                <h1>DATA DATA DATA</h1>
                <Dashboard />
            </div>
        )
    }
}