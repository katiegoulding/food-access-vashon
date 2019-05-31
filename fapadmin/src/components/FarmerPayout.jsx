import React from "react";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Responsive, Segment, Table, TableRow, Button, Label, Icon, Header, Confirm } from "semantic-ui-react";

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
    this.listenForUpdates()
  }

  componentWillUnmount() {
    this.authUnsub();
  }

  handleChange(evt) {
    this.setState({ value: evt.target.value });
  }

  listenForUpdates = () => {
    // let farmerList = this.state.farmerList
    let farmerRef = firebase.database().ref('users')
    farmerRef.on('child_changed', (_snapshot) => {
        this.loadPayoutRecords()
    })
  }

  loadPayoutRecords = () => {
    let farmerList = []
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
                Object.keys(vouchersList).forEach((voucher) => {
                    totalBucks++
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
                    bucksNotPaid: bucksNotPaid,
                    lastPayoutDate: childSnapshot.val().lastPayoutDate
                })
            }
        });
        this.setState({
            farmerList
        })
    });
    console.log("after set state, farmerList: ", farmerList)
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  // On Button click set the unpaid voucher list to be paidOut: true
  completePayout = (farmerUid) => {
    console.log("farmerUid", farmerUid)
    let farmerRef = firebase.database().ref('users/' + farmerUid + "/vouchersList")
    farmerRef.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let key = childSnapshot.key
            console.log("key", key)
            let payoutRef = firebase.database().ref('users/' + farmerUid + "/vouchersList")
            payoutRef.update({
                [key]: "paid"
            })
        }) 
        let dateObj = new Date()
        let prettyDate = (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear()
        console.log("prettyDate: ", prettyDate)
        let dateRef =  firebase.database().ref('users/' + farmerUid)
        dateRef.update({
          lastPayoutDate: prettyDate
        })
    })
    this.close()
  }

  render() {
    const { farmerList } = this.state
    console.log("farmerList: ", farmerList)

    return (
        <Segment raised>
        <Header textAlign="center" as="h3">Farmer Payout Records</Header>

          {/* Regular View */}
          <Responsive as={Table} minWidth={1024} singleLine selectable stackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Farm</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell collapsing>Total Bucks Collected</Table.HeaderCell>
                <Table.HeaderCell collapsing>Outstanding Bucks</Table.HeaderCell>
                <Table.HeaderCell collapsing>Last Payout Date</Table.HeaderCell>
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
                            <Table.Cell>
                            {(element.bucksNotPaid === 0) ? 
                                <Button compact basic color='green'>
                                <Icon color='green' name='checkmark' size='small' />
                                All Paid Up!
                                </Button>
                                : 
                                <Button as='div' labelPosition='left'>
                                    <Label basic as='a' pointing='right'>
                                    {element.bucksNotPaid} Bucks / ${element.bucksNotPaid * 2}.00
                                    </Label>
                                    <Button color='green' icon onClick={this.open}>
                                        <Icon name='dollar sign' />
                                        Mark as Paid
                                    </Button>
                                    <Confirm 
                                        size='small' 
                                        header="Confirm Payout?"
                                        content={`This will mark (${element.bucksNotPaid}) unpaid bucks as PAID for ${element.name} at ${element.farm}`}
                                        cancelButton='Cancel'
                                        confirmButton="Mark as paid"
                                        open={this.state.open} 
                                        onCancel={this.close} 
                                        onConfirm={() => this.completePayout(element.farmerUid)} />
                                </Button>
                              }
                              </Table.Cell>
                              <Table.Cell>{element.lastPayoutDate}</Table.Cell>
                          </TableRow>
                    )
                }
            )
            } 
          </Table.Body>
          </Responsive>

          {/* Mobile View */}
          <Responsive as={Table} maxWidth={1023} compact="very" singleLine selectable stackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell collapsing>Total Bucks Collected</Table.HeaderCell>
                <Table.HeaderCell collapsing>Outstanding Bucks</Table.HeaderCell>
                <Table.HeaderCell collapsing>Last Payout Date</Table.HeaderCell>
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
                            <Table.Cell>
                            <Header as='h4'>
                              <Header.Content>
                              {element.name}
                                <Header.Subheader>{element.farm}</Header.Subheader>
                              </Header.Content>
                            </Header>
                            </Table.Cell>

                            <Table.Cell>{element.email}</Table.Cell>
                            <Table.Cell>{element.totalBucks}</Table.Cell>
                            <Table.Cell>
                            {(element.bucksNotPaid === 0) ? 
                                <Button compact basic color='green' size="mini">
                                <Icon color='green' name='checkmark' size='small' />
                                All Paid Up!
                                </Button>
                                : 
                                <Button as='div' labelPosition='left'>
                                    <Label basic as='a' pointing='right'>
                                    {element.bucksNotPaid} Bucks / ${element.bucksNotPaid * 2}.00
                                    </Label>
                                    <Button color='green' icon onClick={this.open}>
                                        <Icon name='dollar sign' />
                                        Mark as Paid
                                    </Button>
                                    <Confirm 
                                        size='small' 
                                        header="Confirm Payout?"
                                        content={`This will mark (${element.bucksNotPaid}) unpaid bucks as PAID for ${element.name} at ${element.farm}`}
                                        cancelButton='Cancel'
                                        confirmButton="Mark as paid"
                                        open={this.state.open} 
                                        onCancel={this.close} 
                                        onConfirm={() => this.completePayout(element.farmerUid)} />
                                </Button>
                              }
                              </Table.Cell>
                              <Table.Cell>{element.lastPayoutDate}</Table.Cell>
                          </TableRow>
                    )
                }
            )
            } 
          </Table.Body>
          </Responsive>
      </Segment>
    );
  }
}
