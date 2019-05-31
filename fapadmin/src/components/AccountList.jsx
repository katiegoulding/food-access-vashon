import React from "react";
import Account from "./Account";
import { Table, Segment, Loader, Dimmer, Responsive } from "semantic-ui-react";

export default class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountSnapshot: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    this.props.accountRef.off("value", this.unlisten);
    this.unlisten = nextProps.accountRef.on("value", snapshot =>
      this.setState({
        accountSnapshot: snapshot
      })
    );
  }

  componentDidMount() {
    this.unlisten = this.props.accountRef.on("value", snapshot =>
      this.setState({ accountSnapshot: snapshot })
    );
  }

  componentWillUnmount() {
    this.props.accountRef.off("value", this.unlisten);
  }

  render() {
    if (!this.state.accountSnapshot) {
      return   <div>
                <Segment>
                  <Dimmer active inverted>
                    <Loader indeterminate>Loading Accounts</Loader>
                  </Dimmer>
                </Segment>
                </div>
    }

    let accts = [];
    this.state.accountSnapshot.forEach(acctSnapshot => {
      if (this.props.user.email !== acctSnapshot.val().email) {
        accts.push(
          <Account
            key={acctSnapshot.key}
            acctSnapshot={acctSnapshot}
            acctRef={this.props.accountRef}
          />
        );
      }
    });

    return (
      <div>
        {/* Regular View */}
        <Responsive as={Table} selectable minWidth={768}>
          <Table.Header>
            <Table.Row collapsing>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Approval Status</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Actions</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Delete Account</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{accts}</Table.Body>
        </Responsive>

        {/* Mobile View */}
        <Responsive as={Table} size="mini" compact="small" maxWidth={767}>
          <Table.Header>
              <Table.Row collapsing>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Approval Status</Table.HeaderCell>
                <Table.HeaderCell>Delete Account</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{accts}</Table.Body>
        </Responsive>
      </div>
    )
  }
}
