import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import Plot from 'react-plotly.js';

export default class EditAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            org: "",
            role: "",
            date_added: "",
            errorMessage: undefined
        }
    }

    handleEditAccount(evt) {
        this.setState({ name: evt.target.value });
        this.setState({ role: evt.target.value });
        this.setState({ org: evt.target.value });
        this.setState({ email: evt.target.value });
    }

    render() {
        return (
            <div>
                <h1>Edit <i>name</i> Account</h1>
                <form onSubmit={evt => this.handleCreateAccount(evt)}>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mx-auto">
                                <label htmlFor="name">Name: </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="form-control"
                                    value={this.state.firstName}
                                    placeholder="<curr name>"
                                    onInput={evt => this.setState({ firstName: evt.target.value })}
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
                                    placeholder="<curr role>"
                                    onInput={evt => this.setState({ role: evt.target.value })}
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
                                    placeholder="<curr org>"
                                    value={this.state.org}
                                    onInput={evt => this.setState({ org: evt.target.value })}
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
                                    placeholder="<curr email>"
                                    value={this.state.email}
                                    onInput={evt => this.setState({ email: evt.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default">
                            Save Changes
                        </button>
                    </div>
                </form>

                <Plot
                    data={[
                        {
                            x: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
                            y: [0.63, 0.29, 0.79, 0.84, 0.65, 0.45, 0.81, 0.50],
                            type: 'bar',
                            name: 'Market'
                        },
                        {
                            x: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
                            y: [0.75, 0.73, 0.96, 0.99, 0.47, 0.64, 0.69, 0.72],
                            type: 'bar',
                            name: 'Stand'
                        },
                        {
                            x: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
                            y: [0.802, 0.46, 0.71, 0.98, 0.685, 0.567, 0.988, 0],
                            type: 'bar',
                            name: 'Other'
                        },
                    ]}
                    layout={{ title: 'Robs Redemption This Season', barmode: 'group', yaxis: { title: "Percent" }, xaxis: { title: "Month" } }}

                />
                <p> <Link to={constants.routes.dash.manageAccount}> Back to Manage </Link> </p>

            </div >
        )
    }
}