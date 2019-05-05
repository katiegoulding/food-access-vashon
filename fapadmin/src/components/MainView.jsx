import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
import { Grid, Container, Divider, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

export default class MainView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            role: ''
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
        let farmerUI = [
            <Route path={constants.routes.dash.base} component={Scan} />
        ];
        let cworkerUI = [
            <Route exact path={constants.routes.dash.base} component={Scan} />,
            <Route path={constants.routes.dash.viewData} component={ViewData} />
        ];
        let adminUI = [
            <Route exact path={constants.routes.dash.base} component={Scan} />,
            <Route path={constants.routes.dash.bucksLanding} component={BucksLanding} />,
            <Route path={constants.routes.dash.manageAccount} component={ManageAccount} />,
            <Route path={constants.routes.dash.viewBucks} component={ViewBucks} />,
            <Route path={constants.routes.dash.createBucks} component={CreateBucks} />,
            <Route path={constants.routes.dash.formSuccess} component={FormSuccess} />
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
                <Grid.Column>
                <Container>

                    <Header as='h2' textAlign="left">
                        FAP
                    </Header>
                </Container>
                </Grid.Column>

                <Sidebar.Pushable as={Segment}>
                <Sidebar
                    as={Menu}
                    animation='push'
                    icon='labeled'
                    inverted
                    onHide={this.handleSidebarHide}
                    vertical
                    visible="true"
                    width='thin'
                >
                    <Menu.Item as={Link} to={constants.routes.dash.viewBucks}><Icon name="line graph" /> View Data</Menu.Item>
                    <Menu.Item as={Link} to={constants.routes.dash.manageAccount}><Icon name="settings" />Manage Data</Menu.Item>
                    <Menu.Item as={Link} to={constants.routes.dash.base}><Icon name="camera"/>Scan</Menu.Item>
                    <Menu.Item as={Link} to={constants.routes.dash.bucksLanding}><Icon name="money bill alternate" />Create Bucks</Menu.Item>

                </Sidebar>
            
                <Sidebar.Pusher>
                    <Segment basic>
                        <Router>
                            <Switch>
                                {ui}
                            </Switch>
                        </Router>
                    </Segment>
                </Sidebar.Pusher>
                </Sidebar.Pushable> 

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