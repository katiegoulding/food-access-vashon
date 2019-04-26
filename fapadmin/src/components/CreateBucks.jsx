import React from 'react';
import ViewBucks from './ViewBucks';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import download from 'downloadjs'
import axios from 'axios'

export default class CreateBucks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            doveCount: 1,
            vyfsCount: 1,
            lacomunidadCount: 1,
            vashonhouseholdCount: 1,
            validYear: 2018
        }
    }

    // takes organization name, voucher count, and a list of ids and saves them in the Firebase Realtime database
    postVoucherData(organization, count, ids) {
        let updates = {}

        for (let i = 0; i < count; i++) {
            let voucherData = {
                organization,
                createdOn: new String(new Date()),
                year: this.state.validYear
            }

            let newVoucherKey = firebase.database().ref().child('vouchers').push().key
            ids.push({ partnerOrg: organization, id: newVoucherKey })

            updates['/vouchers/' + newVoucherKey] = voucherData
        }
        return firebase.database().ref().update(updates)
    }

    // On submit of the Create Voucher form the function saves given data to
    // Firebase and calls postData to Google Cloud Function to generate pdf
    handleSubmit() {
        const { doveCount, vyfsCount, lacomunidadCount, vashonhouseholdCount } = this.state
        console.log('handle submit is getting fired')

        //post the data, wait on each one to resolve
        let ids = []
        let promise1 = this.postVoucherData('dove', doveCount, ids)
        let promise2 = this.postVoucherData('vyfs', vyfsCount, ids)
        let promise3 = this.postVoucherData('lacomunidad', lacomunidadCount, ids)
        let promise4 = this.postVoucherData('vashonhousehold', vashonhouseholdCount, ids)

        let body = {
            Year: this.state.validYear,
            ids
        }

        console.log('body stringified = ', JSON.stringify(body))
        body.ids.forEach((id) => {
            console.log(id);
        });
        
        Promise.all([promise1, promise2, promise3, promise4]).then(
            doesPass => {
                axios.post(`https://us-central1-fapadmin-97af8.cloudfunctions.net/helloWorld`, body, {
                    responseType: 'blob', //Force to receive data in a Blob Format
                })
                    .then(response => {
                        //Create a Blob from the PDF Stream
                        const file = new Blob(
                            [response.data],
                            { type: 'application/pdf' });
                        //Build a URL from the file
                        const fileURL = URL.createObjectURL(file);
                        //Open the URL on new Window
                        window.open(fileURL);
                        const link = document.createElement('a');
                        link.href = fileURL;
                        link.setAttribute('download', 'file.pdf');
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        ).catch(
            err => {
                console.log("Error on firebase request", err);
            }
        )
        console.log('firebase.functions() = ', firebase.functions())
    }

    render() {
        return (
            <div>
                <form onSubmit={evt => this.handleSubmit()}>
                    <label>
                        Name of Buck Set:
                        <input type="text" name="buck set name" />
                    </label>
                    <label>
                        Valid Year
                        <input
                            type="number"
                            name="validYear"
                            value={this.state.validYear}
                            onInput={evt => this.setState({ validYear: evt.target.value })} />
                    </label>
                    <p>Organization Buck Counts</p>
                    <label>
                        Dove
                        <input
                            type="number"
                            name="doveCount"
                            placeholder="number of bucks"
                            value={this.state.doveCount}
                            onInput={evt => this.setState({ doveCount: evt.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        VYFS
                        <input
                            type="number"
                            name="vyfsCount"
                            placeholder="number of bucks"
                            value={this.state.vyfsCount}
                            onInput={evt => this.setState({ vyfsCount: evt.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        La Comunidad
                        <input
                            type="number"
                            name="lacomunidadCount"
                            placeholder="number of bucks"
                            value={this.state.lacomunidadCount}
                            onInput={evt => this.setState({ lacomunidadCount: evt.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Vashon Household
                        <input
                            type="number"
                            name="vashonhouseholdCount"
                            placeholder="number of bucks"
                            value={this.state.vashonhouseholdCount}
                            onInput={evt => this.setState({ vashonhouseholdCount: evt.target.value })}
                        />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

}