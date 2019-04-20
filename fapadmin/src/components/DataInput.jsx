import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";

export default class DataInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dist: "",
            org: "",
            dollar: "",
            body: ""
        }
        this.handleChangeDist = this.handleChangeDist.bind(this);
        this.handleChangeOrg = this.handleChangeOrg.bind(this);
        this.handleChangeDollar = this.handleChangeDollar.bind(this);

    }
    handleChangeDist(evt) {
        this.setState({dist: evt.target.value});
    }

    handleChangeOrg(evt) {
        this.setState({org: evt.target.value});
    }

    handleChangeDollar(evt) {
        this.setState({dollar: evt.target.value});
    }
    
    handleSubmit(evt) {
        evt.preventDefault();
    }

    render() {
        return (
            <div>
                <h1>Input Data</h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                    <label>
                        Distribution or Redemption:  
                        <select value={this.state.dist} onChange={this.handleChangeDist}>
                            <option value="distribution">Distribution</option>
                            <option value="redemption">Redemption</option>
                        </select>
                    </label>
                    </div>
                    
                    <div>
                        <label>
                            Partner Organization:
                            <select value={this.state.org} onChange={this.handleChangeOrg}>
                                <option value="foodbank">Food Bank</option>
                                <option value="dove">DoVE</option>
                                <option value="vcc">Vashon Community Care</option>
                                <option value="seniorcenter">Senior Center</option>
                                <option value="interfaith">Interfaith Council to Prevent Homelessness</option>
                                <option value="vashonhousehold">Vashon Household</option>
                                <option value="lacomunidad">La Comunidad</option>
                                <option value="vyfs">Vashon Youth and Family Services</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Dollar Amount:
                            </label>
                            <input type="text" value={this.state.dollar} onChange={this.handleChangeDollar} />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
    
}