import React from "react";
import DataInput from "./DataInput";
import { Link, Redirect } from "react-router-dom";
import constants from "./constants";
import Dashboard from "./Dashboard";


export default class MainActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",        
            chartData: {
                labels: [],
                datasets:[
                  {
                    label:'Partner Orgs',
                    data:[],
                    backgroundColor:[
                    ]
                  }
                ]
            }
        }
    }
    
    render() {
        return (
            <div>
                <h1>Main Screen</h1>
                <DataInput/>
                <Dashboard chartData={this.state.chartData} />
            </div >
        );
    }
}