import React from "react";
import firebase from "firebase";
import { Table, Icon, Header, Button, Confirm } from "semantic-ui-react";

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: ""
    };
  }

  handlePurge() {
    console.log("in purge function")
    var deleteUser = firebase.functions().httpsCallable("deleteUser");
    deleteUser({ email: this.props.acctSnapshot.val().email }).then(result => {
      console.log(result);
    });
    this.props.acctRef.child(this.props.acctSnapshot.key).remove();
    this.close()
  }

  handleApprove() {
    let acct = this.props.acctSnapshot.val();
    this.props.acctRef.child(this.props.acctSnapshot.key).update({
      approved: true
    });
    var changeRole = firebase.functions().httpsCallable("changeRole");
    changeRole({
      email: acct.email,
      role: acct.role
    }).then(result => {
      console.log(result);
    });
  }

  open = () => {
    console.log("in open function")
    this.setState({ open: true })
  }

  close = () => {
    console.log("in close function")
    this.setState({ open: false })
  }

  render() {
    // let user = firebase.auth().currentUser;
    let acct = this.props.acctSnapshot.val();
    let appEl;

    if (acct.approved) {
      appEl = (
        <Table.Cell>
          <Icon name="checkmark" />
          Approved
        </Table.Cell>
      );
    } else {
      appEl = (
        <Table.Cell>
          <Icon name="attention" />
          Requires Approval
        </Table.Cell>
      );
    }


    return (
      <Table.Row warning={!acct.approved}>
        <Table.Cell>
          
        <Header as='h4'>
          <Header.Content>
            {acct.firstName} {acct.lastName}
            <Header.Subheader>{acct.org}</Header.Subheader>
          </Header.Content>
        </Header>
        </Table.Cell>
        <Table.Cell>{acct.role}</Table.Cell>
        <Table.Cell>{acct.email}</Table.Cell>
        {appEl}
        <Table.Cell textAlign="center">
          {acct.approved ? null : (
            <Button.Group>
              <Button size='mini' positive content="Approve" onClick={() => this.handleApprove()}/>
              <Button size='mini' content="Reject" onClick={() => this.handlePurge()}/>
            </Button.Group>
          )}
        </Table.Cell>
        <Table.Cell textAlign='center'>
          <Icon
              name="delete"
              className="delete"
              size="large"
              onClick={this.open}
            />
            <Confirm 
              size='small' 
              header="Are you sure?"
              content={`Are you sure you want to delete the account of ${acct.firstName} ${acct.lastName}? This action cannot be undone`}
              cancelButton='Cancel'
              confirmButton="Delete Account"
              open={this.state.open} 
              onCancel={this.close} 
              onConfirm={() => this.handlePurge()} />
        </Table.Cell>
      </Table.Row>
    );
  }
}
