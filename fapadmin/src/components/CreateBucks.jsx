import React from 'react';
import ViewBucks from './ViewBucks';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import { Dropdown, Input, Header, Button, Icon, Divider, Grid, Segment } from 'semantic-ui-react'
import axios from 'axios'


export default class CreateBucks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            doveCount: "",
            vyfsCount: "",
            lacomunidadCount: "",
            vashonhouseholdCount: "",
            validYear: 2018,
            loading: false,
            errors: null,
            buckSetName: "",
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
    handleSubmit = (event) => {
        event.preventDefault()
        const { doveCount, vyfsCount, lacomunidadCount, vashonhouseholdCount } = this.state

        let sum = doveCount + vyfsCount + lacomunidadCount + vashonhouseholdCount
        
        const promiseFromFirebase = firebase.database().ref().child('buckSets/' + this.state.buckSetName).update(
            {
                name: this.state.buckSetName,
                createdOn: new String(new Date()),
                year: this.state.validYear,
                voucherCount: sum
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
            Year: this.state.validYear,
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
                            loading: false
                        });
                    })
                    .catch(error => {
                        error.json().then((json) => {
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
        let sum = (this.state.doveCount + this.state.vyfsCount + this.state.lacomunidadCount + this.state.vashonhouseholdCount)
 
        return (
            <div class="ui raised very padded text container segment">
            
            <form onSubmit={this.handleSubmit}>
                    {(errors)
                        ? (<div className="form-group">
                            <div className="alert alert-danger"><strong>Error!</strong> {errors.message || 'Something went wrong.'}</div>
                        </div>
                        )
                        : null
                    }

                <Divider hidden />
                
                <div class="ui stackable two column centered grid">
                    <div class="two column centered row">
                        <div class="column">  
                            <Input 
                                transparent
                                size='massive'
                                placeholder="Set Name" 
                                name="buckSetName" 
                                type="text" 
                                value={this.state.buckSetName}
                                onInput={evt => this.setState({ buckSetName: evt.target.value })}
                            />
                            <Divider />
                        </div> 
                    </div>
                </div>

                <Divider hidden />

                {/* TODO: Set params on input boxes to not go below 0 */}
                <Header size='medium'>Buck Allocation</Header>

                  <Grid stackable centered rows={2}>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                    label='DOVE' 
                                    type="number"
                                    value={this.state.doveCount}
                                    placeholder="0"
                                    onInput={evt => this.setState({ doveCount: Number(evt.target.value) })}  
                                />
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                    label='VYFS' 
                                    type="number"
                                    value={this.state.vyfsCount}
                                    placeholder="0"
                                    onInput={evt => this.setState({ vyfsCount: Number(evt.target.value) })}  
                                />
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                label='La Communidad' 
                                type="number"
                                value={this.state.lacomunidadCount}
                                placeholder="0"
                                onInput={evt => this.setState({ lacomunidadCount: Number(evt.target.value) })}  
                            />
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <Input 
                                label='Vashon Household' 
                                type="number"
                                value={this.state.vashonhouseholdCount}
                                placeholder="0"
                                onInput={evt => this.setState({ vashonhouseholdCount: Number(evt.target.value) })}  
                            />
                        </Segment>
                    </Grid.Row>
                </Grid>

                {/* <div class="ui stackable four column grid">
                    <div class="column">
                        <Input 
                            label='DOVE' 
                            type="number"
                            value={this.state.doveCount}
                            placeholder="0"
                            onInput={evt => this.setState({ doveCount: Number(evt.target.value) })}  
                        />
                    </div>

                    <div class="column">
                        <Input 
                            label='VYFS' 
                            type="number"
                            value={this.state.vyfsCount}
                            placeholder="0"
                            onInput={evt => this.setState({ vyfsCount: Number(evt.target.value) })}  
                        />
                    </div>

                    <div class="column">
                        <Input 
                            label='La Communidad' 
                            type="number"
                            value={this.state.lacomunidadCount}
                            placeholder="0"
                            onInput={evt => this.setState({ lacomunidadCount: Number(evt.target.value) })}  
                        />
                    </div>  

                    <div class="column">
                        <Input 
                            label='Vashon Household' 
                            type="number"
                            value={this.state.vashonhouseholdCount}
                            placeholder="0"
                            onInput={evt => this.setState({ vashonhouseholdCount: Number(evt.target.value) })}  
                        />
                    </div>
                </div>
                 */}
                {/* TODO: wrap in function that allows additional org and dollar amt to be added 
                    How to not fire "handleSubmit" with this button here?
                */}
                {/* <form onSubmit={evt => this.handleAddOrg(evt)}>
                    <Button icon labelPosition='left' basic color='blue'>
                        <Icon name="add circle" />
                        Add Organization
                    </Button>
                </form> */}

                <div class="ui stackable two column centered grid">
                    <div class="two column centered row">
                        <div class="column">  
                            <Divider />
                        </div> 
                    </div>
                </div>
                
                <Header size='medium'>Distribution Total</Header>
                <Header size="large">${2 * sum}</Header>

                {(loading) ? <Button loading color='blue'>Generate Set</Button> : <Button color='blue'>Generate Set</Button>}
                </form>
            </div>

        )
    }
}

                    /* <label>
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
                    {(loading) ? <button class="ui disabled button"></button> : <button class="ui blue button">Generate Set</button>}
                </form> */
         


// <div>                       
// {/* TODO: Fix dropdown since it doesn't change state onInput */}
// <Dropdown 
//    placeholder='Organization'
//    style={{width: "180px"}}
//    selection
//    options = {[
//        {
//           key: 'dove',
            // text: 'DOVE',
            // value: 'dove'
//         },
//         {
//             key: 'vyfs',
//             text: 'VYFS',
//             value: 'vyfs'
//         },
//         {
//             key: 'lacomunidad',
//             text: 'La Comunidad',
//             value: 'lacomunidad'
//         },
//         {
//             key: 'vashonhousehold',
//             text: 'Vashon Household',
//             value: 'vashonhousehold'
//         },
//     ]}
//     //value={this.state.organization}
//     onInput={evt => this.setState({ organization: evt.target.value })}

// />
// </div> 