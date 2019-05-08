import React from "react";
import firebase from "firebase";
import { Table, Icon } from "semantic-ui-react";

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: ""
    };
  }

  handlePurge() {
    var deleteUser = firebase.functions().httpsCallable("deleteUser");
    deleteUser({ email: this.props.acctSnapshot.val().email }).then(result => {
      console.log(result);
    });
    this.props.acctRef.child(this.props.acctSnapshot.key).remove();
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
      <Table.Row>
        <Table.Cell>
          {acct.firstName} {acct.lastName}
        </Table.Cell>
        <Table.Cell>{acct.email}</Table.Cell>
        <Table.Cell>{acct.org}</Table.Cell>
        <Table.Cell>{acct.role}</Table.Cell>
        {appEl}
        <Table.Cell textAlign="right">
          {acct.approved ? null : (
            <Icon
              name="check circle"
              ref="ebutt"
              className="approve"
              onClick={() => this.handleApprove()}
              size="large"
            />
          )}
          <Icon
            onClick={() => this.handlePurge()}
            name="user delete"
            className="delete"
            size="large"
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}
