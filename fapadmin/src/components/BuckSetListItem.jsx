import React from 'react';
import { Button, Card, Modal, Confirm } from 'semantic-ui-react';
import firebase from 'firebase/app';

export default class BuckSetListItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            viewModalOpen: false,
            deleteModalOpen: false
        }
    }

    showView = () => this.setState({ viewModalOpen: true })

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    deleteBuckSet = () => {
        let key = this.props.data.name
        console.log("buck set title ", this.props.data.name)
        //TODO: make if(!key) {...} and throw an error 
        if(key != '') {
            let buckSetRef = firebase.database().ref('buckSets/' + key)
            console.log("buckSetRef ", buckSetRef)

            buckSetRef.remove()
            .then(() =>{
                console.log("Remove succeeded.")
                this.setState({
                    deleteModalOpen: false
                })
            })
            .catch((error) => {
                console.log("Remove failed: " + error.message)
            });
        }
        this.close()
    }

    viewBuckSet = () => {
    
    }



    render () { 
        const { name, 
                createdBy, 
                data, 
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
        const { open } = this.state

        let dateObj = new Date(createdOn)
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
                                <p><b>Created by</b> {createdBy}</p>
                                <p><b>Created on</b> {prettyDate}</p>
                                <p><b>Expires</b> {expirationDate}</p>
                                <h4>Counts</h4>
                                <p>Community Care: {communitycareCount}</p>
                                <p>Community Meals: {communitymealsCount}</p>
                                <p>DOVE: {doveCount}</p>
                                <p>Food Bank: {foodbankCount}</p>
                                <p>Interfaith Council: {interfaithCount}</p>
                                <p>La Comunidad: {lacomunidadCount}</p>
                                <p>Senior Center: {seniorcenterCount}</p>
                                <p>Vashon Household: {vashonhouseholdCount}</p>
                                <p>VYFS: {vyfsCount}</p>
                                <p>VYFS Family Place: {vyfsfamilyplaceCount}</p>
                                <p>VYFS Latinx Count: {vyfslatinxCount}</p>

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

                        {/* <Modal trigger={<Button icon='trash'/>} 
                                size="mini" 
                                open={this.deleteModalOpen} 
                                onClose={this.close}
                                closeIcon >
                            <Modal.Header>Are you sure you want to delete "{name}" Buck Set?</Modal.Header>
                            <Modal.Content>
                                <p>Doing so will mark all VIGA bucks generated for this set as inactive</p>
                                
                            </Modal.Content>
                            <Modal.Actions>

                                <Button color="red" onClick={() => this.deleteBuckSet()}  content='Delete' />

                            </Modal.Actions>
                        </Modal> */}
                    </Card.Content>
                </Card>
        )
    }
}
