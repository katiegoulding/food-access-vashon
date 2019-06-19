import React from 'react';
import { Button, Card, Modal, Confirm, List } from 'semantic-ui-react';
import firebase from 'firebase/app';

export default class BuckSetListItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    showView = () => this.setState({ viewModalOpen: true })

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    deleteBuckSet = () => {

        //delete under buckSets node
        let buckSetName = this.props.data.name
        console.log("buck set title ", this.props.data.name)
        if(buckSetName && buckSetName !== "") {
            let buckSetRef = firebase.database().ref('buckSets/' + buckSetName)
            console.log("buckSetRef ", buckSetRef)
            buckSetRef.remove()
            .then(() =>{
                console.log("Remove succeeded.")

            })
            .catch((error) => {
                console.log("Remove failed: " + error.message)
            });
        }

        //delete under vouchers node
        let voucherRef = firebase.database().ref('vouchers/')
        voucherRef.once("value", snapshot => {
            let deleteCount = 0
            snapshot.forEach(function(childSnapshot) {
                let deleteRef = firebase.database().ref('vouchers/' + childSnapshot.key)
                if(childSnapshot.val().buckSet === buckSetName) {
                    deleteCount++
                    deleteRef.remove()
                    .then(() =>{
                        console.log("Remove succeeded.")
                    })
                    .catch((error) => {
                        console.log("Remove failed: " + error.message)
                    });
                }
            })
            console.log("deleteCount", deleteCount)
        })

        // only delete from vis nodes if there is no data under the other nodes besides Created
        
        //delete under vis1 node

        //delete under vis2 node

        this.close()
    }

    render () { 
        const { name, 
                createdBy, 
                createdOn, 
                expirationDate,
                communitycareCount,
                communitymealsCount,
                doveCount,
                foodbankCount,
                interfaithCount,
                lacomunidadCount,
                seniorcenterCount,
                vashonhouseholdCount,
                vyfsCount,
                vyfsfamilyplaceCount,
                vyfslatinxCount
             } = this.props.data
        
        let dateObj = new Date(createdOn)
        console.log("createdOn", createdOn)
        let prettyDate = (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear()

        return(
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{name}</Card.Header>
                        <Card.Meta>{createdBy}</Card.Meta>
                    </Card.Content>

                    <Card.Content extra>
                        <Modal trigger={<Button primary content='View'/>}
                            size="small" 
                            open={this.viewModalOpen} 
                            onClose={this.close} 
                            closeIcon >
                            <Modal.Header>"{name}" Buck Set</Modal.Header>
                            <Modal.Content>
                                <List size="large">
                                    <List.Item>
                                        <List.Header>Created by: </List.Header>
                                        <List.List>
                                            <List.Item>{createdBy}</List.Item>
                                        </List.List>
                                    </List.Item>
                                    <List.Item>
                                    <List.Header>Created on: </List.Header>
                                        <List.List>
                                            <List.Item>{prettyDate}</List.Item>
                                        </List.List>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Expires on: </List.Header>
                                        <List.List>
                                            <List.Item>{expirationDate}</List.Item>
                                        </List.List>
                                    </List.Item>
                                    <List.Item>
                                        <List.Header>Counts Per Partner Org:</List.Header>
                                        <List.List>
                                            <List.Item>{communitycareCount} - Community Care</List.Item>
                                            <List.Item>{communitymealsCount} - Community Meals</List.Item>
                                            <List.Item>{doveCount} - DOVE</List.Item>
                                            <List.Item>{foodbankCount} - Food Bank</List.Item>
                                            <List.Item>{interfaithCount} - Interfaith Council</List.Item>
                                            <List.Item>{lacomunidadCount} - La Comunidad</List.Item>
                                            <List.Item>{seniorcenterCount} - Senior Center</List.Item>
                                            <List.Item>{vashonhouseholdCount} - Vashon Household</List.Item>
                                            <List.Item>{vyfsCount} - VYFS</List.Item>
                                            <List.Item>{vyfsfamilyplaceCount} - VYFS Family Place</List.Item>
                                            <List.Item>{vyfslatinxCount} - VYFS Latinx Count</List.Item>
                                        </List.List>
                                    </List.Item>
                                </List>

                            </Modal.Content>
                        </Modal>

                        <Button icon="trash" onClick={this.open}/>
                        <Confirm 
                            size='small' 
                            header={`Are you sure you want to delete ${name} Buck Set?`}
                            content="Doing so will mark all VIGA bucks generated for this set as inactive"
                            cancelButton="Cancel"
                            confirmButton="Delete"
                            open={this.state.open} 
                            onCancel={this.close} 
                            onConfirm={() => this.deleteBuckSet()} />
                    </Card.Content>
                </Card>
        )
    }
}
