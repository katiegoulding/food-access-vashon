import React from "react";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Container, Segment, Table } from "semantic-ui-react";

export default class FarmerPayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        currentUser: user
      });
      if (!this.state.currentUser) { //changed from === null
        this.props.history.push(constants.routes.base);
      }
    });
  }

  componentWillUnmount() {
    this.authUnsub();
  }

  handleChange(evt) {
    this.setState({ value: evt.target.value });
  }

  loadPayoutRecords() {
    let farmerList = []
    let payoutRef = firebase.database().ref("/users/");
    payoutRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let value = childSnapshot.val()
            if(value.role.ignoreCase === 'farmer' && value.approved.ignoreCase ==='true') {
                farmerList.push()
            }
        });
    });
    // filter by role == farmer
    // load all users that are farmers AND are approved
    // get their voucher list, check the flag (expecting either "paid" or "paidNot")
    // search all those vouchers -> confirmed they've been redeemed AND check if they've been paid out
    // if they haven't been paid out, add them to a list and get the count 
  }

  // On Button click set the unpaid voucher list to be paidOut: true
  completePayout() {

  }

  render() {

    return (
      <Container>
        <Segment
          style={{
            paddingTop: "30px",
            paddingRight: "40px",
            paddingLeft: "40px"
          }}
          raised
        >
          <Container>
          <Table singleLine stackable selectable> 
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Farm</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Total Bucks Collected</Table.HeaderCell>
                <Table.HeaderCell>Unpaid Bucks</Table.HeaderCell>
                <Table.HeaderCell>Mark As Paid</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body></Table.Body>
            </Table>
          </Container>
        </Segment>
      </Container>
    );
  }
}
