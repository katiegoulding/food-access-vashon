import React from "react";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";

export default class DataInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            body: ""
        }
        //this.handleChange = this.handleChange.bind(this);
    }

    handleChangeOrg(evt) {
        this.setState({value: evt.target.value});
    }

    handleChangeDist(evt) {
        this.setState({value: evt.target.value});
    }

    handleChangeDollar(evt) {
        this.setState({value: evt.target.value});
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
                        <select value={this.state.value} onChange={this.handleChangeDist}>
                            <option value="distribution">Distribution</option>
                            <option value="redemption">Redemption</option>
                        </select>
                    </label>
                    </div>
                    
                    <div>
                        <label>
                            Partner Organization:
                            <select value={this.state.value} onChange={this.handleChangeOrg}>
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

                            <input type="text" value={this.state.value} onChange={this.handleChangeDollar} />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
    
}