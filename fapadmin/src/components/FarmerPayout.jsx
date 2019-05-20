import React from "react";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Container, Segment, Table, TableRow, Button, Label, Icon } from "semantic-ui-react";

export default class FarmerPayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        farmerList: [],
        paidUp: false
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

    this.loadPayoutRecords()
  }

  componentWillUnmount() {
    this.authUnsub();
  }

  handleChange(evt) {
    this.setState({ value: evt.target.value });
  }

  loadPayoutRecords = () => {
    let farmerList = this.state.farmerList
    let payoutRef = firebase.database().ref("/users/");
    payoutRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let role = childSnapshot.val().role.toLowerCase()
            let approved = childSnapshot.val().approved.toString().toLowerCase()

            let totalBucks = 0
            let bucksNotPaid = 0
            //maybe can get rid of if statement...
            if(childSnapshot.val().vouchersList) {
                let vouchersList = childSnapshot.val().vouchersList  
                console.log("vouchersList", vouchersList)
                Object.keys(vouchersList).forEach((voucher) => {
                    totalBucks++
                    console.log("voucher", voucher)
                    console.log("voucher.val()", vouchersList[voucher])

                    if(vouchersList[voucher].toLowerCase() === 'notpaid') {
                        bucksNotPaid++
                    }
                })
            }

            if(role === 'farmer' && approved === 'true') {
                farmerList.push({
                    name: childSnapshot.val().firstName + " " + childSnapshot.val().lastName,
                    farmerUid: childSnapshot.key,
                    farm: childSnapshot.val().org,
                    email: childSnapshot.val().email,
                    totalBucks: totalBucks,
                    bucksNotPaid: bucksNotPaid
                })
            }
        });
        this.setState({
            farmerList
        })
    });
    console.log("after set state, farmerList: ", farmerList)

    // filter by role == farmer
    // load all users that are farmers AND are approved
    // get their voucher list, check the flag (expecting either "paid" or "paidNot")
    // search all those vouchers -> confirmed they've been redeemed AND check if they've been paid out
    // if they haven't been paid out, add them to a list and get the count 
  }

  // On Button click set the unpaid voucher list to be paidOut: true
  completePayout = (farmerUid) => {
    console.log("farmerUid", farmerUid)
    let farmerRef = firebase.database().ref('users/' + farmerUid + "/vouchersList")
    farmerRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let key = childSnapshot.key
            console.log("key", key)
            let payoutRef = firebase.database().ref('users/' + farmerUid + "/vouchersList")
            payoutRef.update({
                [key]: "paid"
            })
        }) 
    })
  }

  render() {
    const { farmerList } = this.state
    console.log("farmerList: ", farmerList)

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
                <Table.HeaderCell textAlign='center'>Outstanding Bucks</Table.HeaderCell>
                {/* <Table.HeaderCell>Mark As Paid</Table.HeaderCell> */}
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {
                //for each item in the data provided, map will create a TableRow
                //that has the respective name, farm, and email
                farmerList.map(
                    (element) => {
                        console.log("element: ", element)
                        return (
                            <TableRow>
                                <Table.Cell>{element.name}</Table.Cell>
                                <Table.Cell>{element.farm}</Table.Cell>
                                <Table.Cell>{element.email}</Table.Cell>
                                <Table.Cell>{element.totalBucks}</Table.Cell>
                                <Table.Cell textAlign='center'>
                                {(element.bucksNotPaid === 0) ? 
                                    <Button compact basic color='green'>
                                    <Icon color='green' name='checkmark' size='small' />
                                    All Paid Up!
                                    </Button>
                                    : 
                                    <Button as='div' labelPosition='left'>
                                        <Label basic as='a' pointing='right'>
                                        ${element.bucksNotPaid * 2}.00 / {element.bucksNotPaid} Bucks
                                        </Label>
                                        <Button color='green' icon onClick={() => this.completePayout(element.farmerUid)}>
                                            <Icon name='dollar sign' />
                                            Mark as Paid
                                        </Button>
                                    </Button>
                                }
                                </Table.Cell>
                            </TableRow>
                        )
                    }
                )
            }
            </Table.Body>
            </Table>
          </Container>
        </Segment>
      </Container>
    );
  }
}
