import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import MainActivity from "./MainActivity.jsx";
import BucksLanding from "./BucksLanding";
import NavigationBar from './NavigationBar';
import constants from "./constants";
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import Scan from './Scan';
import ViewData from './ViewData';
import ManageAccount from './ManageAccount';
import EditAccount from './EditAccount';
import CreateBucks from './CreateBucks.jsx';
import ViewBucks from './ViewBucks.jsx'
import FormSuccess from './FormSuccess.jsx'

export default class MainView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            role: '',
            username: 'JOHN DOE TEST USERNAME'
        }
    }

    handleSignOut() {
        firebase.auth().signOut()
            .then(this.props.history.push(constants.routes.base))
    };

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push(constants.routes.base)
            } else {
                user.getIdTokenResult().then(idTokenResult => {
                    this.setState({
                        role: idTokenResult.claims.role
                    })
                });
            }
        });
    }

    render() {
        // TODO: Set userId in state
        let farmerUI = [
            <Route exact path={constants.routes.dash.base} render={() => (<Scan role = {this.state.role} userId = {this.state.userId}/> )} />
        ];
        let cworkerUI = [
            <Route exact path={constants.routes.dash.base} render={() => (<Scan role = {this.state.role} userId = {this.state.userId}/> )} />,
            <Route path={constants.routes.dash.viewData} component={ViewData} />
        ];
        let adminUI = [
            <Route exact path={constants.routes.dash.base} render={() => (<Scan role = {this.state.role} userId = {this.state.userId}/> )} />,
            <Route path={constants.routes.dash.bucksLanding} component={() => <BucksLanding username = {this.state.username} />} />,
            <Route path={constants.routes.dash.manageAccount} component={ManageAccount} />,
            <Route path={constants.routes.dash.base} render={() => (<ViewData/> )} />,
            <Route path={constants.routes.dash.createBucks} render={() => (<CreateBucks username = {this.state.username}/> )} />
        ];

        let ui;

        if (this.state.role === 'admin') {
            ui = adminUI;
        } else if (this.state.role === 'caseworker') {
            ui = cworkerUI;
        } else {
            ui = farmerUI;
        }

        return (
            <div>
                <h1>Food Access Partnership Dashbboard</h1>
                <NavigationBar role={this.state.role} />
                <Router>
                    <Switch>
                        {ui}
                    </Switch>
                </Router>

                <button
                    type="submit"
                    className="btn btn-danger col-1"
                    onClick={() => this.handleSignOut()}>
                    Sign Out
                </button>
            </div>
        )
    }
}