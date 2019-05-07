import React from "react";
import Account from "./Account";
import { Table } from "semantic-ui-react";

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
      return <div>Loading... please be patient</div>;
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
      <Table celled unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Org</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Approved</Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>{accts}</Table.Body>
      </Table>
    );
  }
}
