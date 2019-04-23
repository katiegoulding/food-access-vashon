import React from "react";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import QrReader from 'react-qr-reader'


export default class Scan extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            result: 'No result',
            legacyMode: false,
        }
    }

    handleScan = data => {
        data = JSON.parse(data)
        if (data) {
            this.setState({
                result: data,
            })
        }
    }
    handleError = (err) => {
        console.error(err)
        this.setState({
            legacyMode: true
        })
    }

    render() {
        let scanner;

        if (this.state.legacyMode) {
            scanner = <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '50%', margin: 'auto' }}
                legacyMode
            />
        } else {
            scanner = <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '50%', margin: 'auto' }}
            />
        }


        return (
            <div>
                <h1>SCAN SCAN SCAN</h1>
                <div>
                    {scanner}
                    <p>Results: {this.state.result}</p>
                </div>
            </div >
        );
    }
}