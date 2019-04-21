import React from 'react';
import ViewBucks from './ViewBucks';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
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
        this.postVoucherData = this.postVoucherData.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

  

    postData = (url = ``, data = {}) => {
    // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => response.json()); // parses JSON response into native Javascript objects 
    }

    postVoucherData(organization, count, ids) {
        let updates = {}

        for(let i = 0; i < count; i++) {
            let voucherData = {
                organization,
                createdOn: new String(new Date()),
                year: this.state.validYear
            }
    
            let newVoucherKey = firebase.database().ref().child('vouchers').push().key
            ids.push({partnerOrd: organization, id: newVoucherKey})

            updates['/vouchers/' + newVoucherKey] = voucherData
        }
        return firebase.database().ref().update(updates)
    }

    handleSubmit(_event) {
        const { doveCount, vyfsCount, lacomunidadCount, vashonhouseholdCount } = this.state
        console.log('handle submit is getting fired')

        //post the data, wait on each one to resolve
        let ids = []
        let promise1 = this.postVoucherData('dove', doveCount, ids)
        let promise2 = this.postVoucherData('vyfs', vyfsCount, ids)
        let promise3 = this.postVoucherData('lacomunidad', lacomunidadCount, ids)
        let promise4 = this.postVoucherData('vashonhousehold', vashonhouseholdCount, ids)

        let body = { 
            year: this.state.validYear,
            ids
        }
        console.log(
            'body = ', body
        )
        Promise.all([promise1, promise2, promise3, promise4]).then(
            doesPass => {
                //call passed successfully to firebase
                // console.log("firebase call successful")
                // console.log('firebase.functions() = ', firebase.functions())
                // let createVoucherPdf = firebase.functions().httpsCallable('helloWorld')
                // createVoucherPdf({ 
                //     year: this.state.validYear,
                //     ids
                // }).then(function(result) {
                // // Read result of the Cloud Function.
                //     console.log("result of call to cloud function:", result)
                // }).catch(
                //     err => {
                //         console.log('err on create pdf call = ', err)
                //     }
                // )
                this.postData(
                    'https://us-central1-fapadmin-97af8.cloudfunctions.net/helloWorld',
                    body
                ).then(
                    data => {
                        console.log('data = ', data)
                    }
                ).catch(
                    err => {
                        console.log('err = ', err)
                    }
                )
            }
        ).catch(
            err => {
                console.log("Error on firebase request", err)
            }
        )
        console.log('firebase.functions() = ', firebase.functions())

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div> 
                <form onSubmit={this.handleSubmit}>
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
                            onChange={this.handleChange}/>
                    </label>
                    <p>Organization Buck Counts</p>
                    <label>
                        Dove
                        <input 
                            type="number"
                            name="doveCount"
                            placeholder="number of bucks"
                            value={this.state.doveCount}
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

}