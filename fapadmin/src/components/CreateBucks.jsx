import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import { Statistic, Header, Button, Divider, Grid, Form, Message, Segment } from 'semantic-ui-react';
import axios from 'axios';

export default class CreateBucks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            complete: false,
            hasError: false,
            errorMessage: ''
        }
    }

    // takes organization name, voucher count, and a list of ids and saves them in the Firebase Realtime database
    postVoucherData(organization, count, ids) {
        let updates = {}

        for (let i = 0; i < count; i++) {
            let voucherData = {
                organization,
                createdOn: new String(new Date()),
                year: this.props.validYear
            }

            let newVoucherKey = firebase.database().ref().child('vouchers').push().key
            ids.push({ partnerOrg: organization, id: newVoucherKey })

            updates['/vouchers/' + newVoucherKey] = voucherData
        }
        return firebase.database().ref().update(updates)
    }

    // return true if validated form data is acceptable, false otherwise
    validateFormData = async (sum) => {
        if (sum <= 0) {
            this.setState({
                errorMessage: 'Sum of vouchers in form must be greater than zero.'
            })
            return false
        }
        
        const { buckSetName } = this.props
        let buckSetsRef = firebase.database().ref('buckSets')
        
        let isTrue = true
        // await the results from firebase, once because this should be done only once the function
        // fires
        await buckSetsRef.orderByChild("name").equalTo(buckSetName).once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let key = childSnapshot.key;
                let childData = childSnapshot.val();
                if(childData.name == buckSetName) {
                    this.setState({
                        errorMessage: 'The buck set name you used already exists.'
                    })
                    isTrue = false
                }
            });
        })
        return isTrue
    }

    // On submit of the Create Voucher form the function saves given data to
    // Firebase and calls postData to Google Cloud Function to generate pdf
    handleSubmit = async (event) => {
        event.preventDefault()
        const { doveCount, vyfsCount, lacomunidadCount, vashonhouseholdCount } = this.props

        this.setState({
            loading: true
        })

        let sum = doveCount + vyfsCount + lacomunidadCount + vashonhouseholdCount
        // await to do a lookup in firebase if the name they're using has been used already
        let isValid = await this.validateFormData(sum)
        if(!isValid) {
            this.setState({
                loading: false
            })
            return
        } else {
            this.setState({
                errorMessage: ''
            })
        }
        
        // Add the new buck set to the list of buckSets in Firebase
        const promiseFromFirebase = firebase.database().ref().child('buckSets/' + this.props.buckSetName).update(
            {
                name: this.props.buckSetName,
                createdOn: new String(new Date()),
                createdBy: this.props.username,
                year: this.props.validYear,
                doveCount: this.props.doveCount,
                vyfsCount: this.props.vyfsCount,
                lacomunidadCount: this.props.lacomunidadCount,
                vashonhouseholdCount: this.props.vashonhouseholdCount,
            }
        )
        
        promiseFromFirebase.then(
            data => {
                console.log('Buckset upload passed')
            }
        ).catch(
            err => {
                console.log('Buckset upload failed with: ', err)
            }
        )

        //post the data, wait on each one to resolve
        let ids = []
        let promise1 = this.postVoucherData('dove', doveCount, ids)
        let promise2 = this.postVoucherData('vyfs', vyfsCount, ids)
        let promise3 = this.postVoucherData('lacomunidad', lacomunidadCount, ids)
        let promise4 = this.postVoucherData('vashonhousehold', vashonhouseholdCount, ids)

        // prepare data for post to Google Cloud Function
        let data = {
            Year: this.props.validYear,
            ids
        }

        // Debugging Purposes: Print data sent to Google Cloud function
        // console.log('data stringified = ', JSON.stringify(data))
        // data.ids.forEach((id) => {
        //     console.log(id);
        // });

        // Call Google Cloud Function to generate PDF of vouchers
        Promise.all([promise1, promise2, promise3, promise4]).then(
            doesPass => {
                axios({
                    method: 'post',
                    url: `https://us-central1-fapadmin-97af8.cloudfunctions.net/helloWorld/`,
                    data: data,
                    responseType: 'blob' //Force to receive data in a Blob Format
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
                        // remove
                        link.parentNode.removeChild(link);
                        this.setState({
                            complete: true,
                            loading: false,
                            errorMessage: ''
                        });
                        const { toggleShowCreateBucks } = this.props
                        toggleShowCreateBucks()
                        
                    })
                    .catch(error => {
                        error.json().then((json) => {
                            console.log('Error = ', error)
                            this.setState({
                                hasError: true,
                                errorMessage: json,
                                loading: false,
                            });
                        })
                    });
            }
        ).catch(
            err => {
                console.log("Error on firebase request", err);
                this.setState({
                    errorMessage: "Error on firebase request"
                })
            }
        )
        console.log('firebase.functions() = ', firebase.functions())

    }

    render() {
        const { loading, errorMessage } = this.state;
        let sum = (this.props.doveCount + this.props.vyfsCount + this.props.lacomunidadCount + this.props.vashonhouseholdCount)

        return (
            <Grid.Column width={10}>
            {/* <div class="ui raised very padded container segment"> */}

            <Segment
                raised
                // style={{
                // "padding-top": "30px",
                // "padding-right": "40px",
                // "padding-left": "40px"
                // }}
            >
            <Form onSubmit={this.handleSubmit} loading={loading} error={errorMessage}>
                <Form.Input 
                        required
                        fluid 
                        transparent
                        size="huge"
                        placeholder="Buck Set Name" 
                        value={this.props.buckSetName}
                        onInput={evt => this.props.handleChange({ buckSetName: evt.target.value })} />

                <Divider hidden/>

                <Form.Input 
                        required
                        fluid 
                        label='Expiration Date' 
                        placeholder="ie: 2018" 
                        type="date"
                        value={this.props.validYear}
                        onInput={evt => this.props.handleChange({ validYear: (evt.target.value) })} 
                    /> 

                <Header as='h5' color='grey' textAlign="left">BUCK ALLOCATION</Header>

                <Form.Input 
                        fluid
                        label='DOVE' 
                        placeholder={0}
                        type="number"
                        value={this.props.doveCount}
                        onInput={evt => this.props.handleChange({ doveCount: Number(evt.target.value) })}  
                        min={0}
                />

                <Form.Input 
                        fluid
                        label='VYFS' 
                        placeholder={0}
                        type="number"
                        value={this.props.vyfsCount}
                        onInput={evt => this.props.handleChange({ vyfsCount: Number(evt.target.value) })}  
                        min={0}
                />

                <Form.Input 
                        fluid
                        label='La Communidad' 
                        placeholder={0}
                        type="number"
                        value={this.props.lacomunidadCount}
                        onInput={evt => this.props.handleChange({ lacomunidadCount: Number(evt.target.value) })}  
                        min={0}
                />

                <Form.Input 
                        fluid
                        label='Vashon Household' 
                        placeholder={0}
                        type="number"
                        value={this.props.vashonhouseholdCount}
                        onInput={evt => this.props.handleChange({ vashonhouseholdCount: Number(evt.target.value) })}  
                        min={0}
                />
                
                <Divider hidden/>
                
                <Statistic.Group widths='two'>
                    <Statistic>
                        <Statistic.Value>{sum * 1}</Statistic.Value>
                        <Statistic.Label>VIGA Bucks</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>${2 * sum}.00</Statistic.Value>
                        <Statistic.Label>Dollars</Statistic.Label>
                    </Statistic>
                </Statistic.Group>

                <Divider hidden />

                {<Button color='blue'>Generate Set</Button>}
                
                <Message
                    error
                    header={errorMessage}
                    content={"form not submitted"}
                    />

                </Form>
                </Segment>
            </Grid.Column>
        )
    }
}