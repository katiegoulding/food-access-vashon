import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import { Input, Header, Button, Icon, Divider, Grid, Segment, Container } from 'semantic-ui-react'
import axios from 'axios'
import { withRouter } from "react-router";
import FormSuccess from './FormSuccess';

export class CreateBucks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            complete: false
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

    // On submit of the Create Voucher form the function saves given data to
    // Firebase and calls postData to Google Cloud Function to generate pdf
    handleSubmit = (event) => {
        event.preventDefault()
        const { doveCount, vyfsCount, lacomunidadCount, vashonhouseholdCount } = this.props
        event.preventDefault()

        let sum = doveCount + vyfsCount + lacomunidadCount + vashonhouseholdCount
        
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

        let data = {
            Year: this.props.validYear,
            ids
        }

        console.log('data stringified = ', JSON.stringify(data))
        data.ids.forEach((id) => {
            console.log(id);
        });

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
                            loading: false
                        });
                        const { toggleShowCreateBucks } = this.props
                        console.log('toggleShowCreateBucks is about to get called')
                        toggleShowCreateBucks()
                        
                    })
                    .catch(error => {
                        error.json().then((json) => {
                            console.log('Error = ', error)
                            this.setState({
                                errors: json,
                                loading: false
                            });
                        })
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
        const { loading, errors } = this.state;
        let sum = (this.props.doveCount + this.props.vyfsCount + this.props.lacomunidadCount + this.props.vashonhouseholdCount)

        return (
            <Grid.Column width={8}>
            <div class="ui raised very padded container segment">
            <form onSubmit={this.handleSubmit}>
                    {(errors)
                        ? (<div className="form-group">
                            <div className="alert alert-danger"><strong>Error!</strong> {errors.message || 'Something went wrong.'}</div>
                        </div>
                        )
                        : null
                    }

                <Divider hidden />
                
                <Container>
                    <Input 
                        textAlign='left'
                        transparent
                        size='massive'
                        placeholder="Set Name" 
                        name="buckSetName" 
                        type="text" 
                        value={this.props.buckSetName}
                        onInput={evt => this.props.handleChange({ buckSetName: evt.target.value })}
                    />
                    <Divider />
                </Container>

                <Divider hidden />

                {/* TODO: Set params on input boxes to not go below 0 */}
                {/* TODO: Make font consistent between form and success */}
                <Header size='medium'>Buck Allocation</Header>

                  <Grid stackable rows={2}>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                    label='DOVE' 
                                    type="number"
                                    value={this.props.doveCount}
                                    placeholder="0"
                                    onInput={evt => this.props.handleChange({ doveCount: Number(evt.target.value) })}  
                                />
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                    label='VYFS' 
                                    type="number"
                                    value={this.props.vyfsCount}
                                    placeholder="0"
                                    onInput={evt => this.props.handleChange({ vyfsCount: Number(evt.target.value) })}  
                                />
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                label='La Communidad' 
                                type="number"
                                value={this.props.lacomunidadCount}
                                placeholder="0"
                                onInput={evt => this.props.handleChange({ lacomunidadCount: Number(evt.target.value) })}  
                            />
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                label='Vashon Household' 
                                type="number"
                                value={this.props.vashonhouseholdCount}
                                placeholder="0"
                                onInput={evt => this.props.handleChange({ vashonhouseholdCount: Number(evt.target.value) })}  
                            />
                        </Segment>
                    </Grid.Row>
                </Grid>
                
                <Divider horizontal>TOTALS</Divider>
                <Header size="large" textAlign='center'>${2 * sum}.00</Header>
                <Header size="large" textAlign='center'>{sum * 1} bucks</Header>
                <Divider hidden />
                {(loading) ? <Button loading color='blue'>Generate Set</Button> : <Button color='blue'>Generate Set</Button>}
                </form>
                </div>
                </Grid.Column>
        )
    }
}

export default withRouter(CreateBucks)
