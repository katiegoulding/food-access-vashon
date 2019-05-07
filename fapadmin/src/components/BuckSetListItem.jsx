import React from 'react';
import { Button, Card, Modal } from 'semantic-ui-react';
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

    showDelete = () => this.setState({ deleteModalOpen: true })

    close = () => this.setState({ deleteModalOpen: false, viewModalOpen: false })

    deleteBuckSet = () => {
        let key = this.props.data.title
        if(key != '') {
            let buckSetRef = firebase.database().ref('buckSets/')
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
    }

    viewBuckSet = () => {
    }

    render () { 
        const { title, subtitle } = this.props.data
        const { open } = this.state

        return(
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{title}</Card.Header>
                        <Card.Meta>{subtitle}</Card.Meta>
                    </Card.Content>

                    <Card.Content extra>
                        <Modal trigger={<Button primary content='View'/>}
                            size="small" 
                            open={this.viewModalOpen} 
                            onClose={this.close} 
                            closeIcon >
                            <Modal.Header>"{title}" Buck Set</Modal.Header>
                            <Modal.Content>
                                <p>Created by {subtitle}</p>
                                <p>More information about the selected buck set</p>
                            </Modal.Content>
                        </Modal>

                        <Modal trigger={<Button icon='trash'/>} 
                                size="mini" 
                                open={this.deleteModalOpen} 
                                onClose={this.close}
                                closeIcon >
                            <Modal.Header>Delete VIGA Buck Set</Modal.Header>
                            <Modal.Content>
                                <p>Are you sure you want to delete "{title}" Buck Set?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color="red" onClick={() => this.deleteBuckSet()}  content='Delete' />
                            </Modal.Actions>
                        </Modal>
                    </Card.Content>
                </Card>
        )
    }
}