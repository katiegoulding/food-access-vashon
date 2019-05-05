import React from "react";
import firebase from "firebase";
import { Table } from "semantic-ui-react";

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
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

  handleEdit() {
    this.setState({
      edit: true
    });
  }

  handleNewEdit(evt) {
    evt.preventDefault();
    console.log("this happened");
    // var user = firebase.auth().currentUser;
    this.props.acctRef.child(this.props.acctSnapshot.key).update({
      role: evt.target.value
    });
    console.log(this.props.acctSnapshot.val().email);
    console.log(evt.target.value);
    var changeRole = firebase.functions().httpsCallable("changeRole");
    changeRole({
      email: this.props.acctSnapshot.val().email,
      role: evt.target.value
    }).then(result => {
      console.log(result);
    });
    this.setState({
      role: evt.target.value,
      edit: false
    });
  }

  render() {
    // let user = firebase.auth().currentUser;
    let acct = this.props.acctSnapshot.val();
    return (
      <Table.Row>
        <Table.Cell>
          {acct.firstName} {acct.lastName}
        </Table.Cell>
        <Table.Cell>{acct.email}</Table.Cell>
        <Table.Cell>{acct.org}</Table.Cell>
        <Table.Cell>
          {this.state.edit ? (
            <select
              value={this.state.role === "" ? acct.role : this.state.role}
              onChange={evt => this.handleNewEdit(evt)}
              type="submit"
            >
              <option value="farmer">Farmer</option>
              <option value="caseworker">Caseworker</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            acct.role
          )}
        </Table.Cell>
        <Table.Cell />
        <Table.Cell>
          <button
            disabled={this.state.edit}
            ref="ebutt"
            className="btn btn-primary remove"
            onClick={() => this.handleEdit()}
          >
            EDIT
          </button>
        </Table.Cell>
        <Table.Cell>
          <button
            className="btn btn-danger remove"
            onClick={() => this.handlePurge()}
          >
            DELETE
          </button>
        </Table.Cell>
      </Table.Row>
    );
  }
}
