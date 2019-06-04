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
        // used to be if(key != '')
        if(key && key !== "") {
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

        let voucherRef = firebase.database().ref('vouchers/')
        // voucherRef.once("value", snapshot => {
        //     snapshot.forEach(function(childSnapshot) {
        //         if(childData)
        //     })
        // })

        this.close()
    }

    viewBuckSet = () => {
    }

    render () { 
        const { name, createdBy } = this.props.data
        // const { open } = this.state

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
                                <p>Created by {createdBy}</p>
                                <p>More information about the selected buck set</p>
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
