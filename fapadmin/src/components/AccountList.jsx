import React from "react";
import Account from "./Account";

export default class AccountList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountSnapshot: undefined
        }
    }

    componentWillReceiveProps(nextProps) {
        this.props.accountRef.off("value", this.unlisten);
        this.unlisten = nextProps.accountRef.on("value", snapshot => this.setState({
            accountSnapshot: snapshot
        }));
    }

    componentDidMount() {
        this.unlisten = this.props.accountRef.on('value',
            snapshot => this.setState({ accountSnapshot: snapshot }));
    }

    componentWillUnmount() {
        this.props.accountRef.off('value', this.unlisten);
    }

    render() {
        if (!this.state.accountSnapshot) {
            return <div>Loading... please be patient</div>
        }

        let accts = [];
        this.state.accountSnapshot.forEach(acctSnapshot => {
            accts.push(<Account key={acctSnapshot.key} acctSnapshot={acctSnapshot} acctRef={this.props.accountRef} />)
        });

        return (
            <div id="acctContainer">
                <table align="center">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Organization</th>
                        <th>Role</th>
                        <th>Date Added</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {accts}
                </table>
            </div>
        );
    }
}