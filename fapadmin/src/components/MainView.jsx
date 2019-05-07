import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import BucksLanding from "./BucksLanding";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Scan from "./Scan";
import ViewData from "./ViewData";
import ManageAccount from "./ManageAccount";
import CreateBucks from "./CreateBucks.jsx";
import styled from "styled-components";
import {
  Container,
  Header,
  Icon,
  Label,
  Menu,
  Segment,
  Sidebar,
  Image
} from "semantic-ui-react";
import logo from "../FAPLogo.png";

const Title = styled.section`
  height: 220px;
  background-image: linear-gradient(to bottom right, #505c86, #404e67);
  position: relative;
`;

const mql = window.matchMedia(`(min-width: 800px)`);

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      username: "",
      sidebarDocked: mql.matches,
      sidebarOpen: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  handleSignOut() {
    firebase
      .auth()
      .signOut()
      .then(this.props.history.push(constants.routes.base));
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.history.push(constants.routes.base);
      } else {
        user.getIdTokenResult().then(idTokenResult => {
          this.setState({
            username: user.email,
            role: idTokenResult.claims.role
          });
        });
      }
    });
  }

  render() {
    // TODO: Set userId in state
    let farmerUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => (
          <Scan role={this.state.role} userId={this.state.userId} />
        )}
      />
    ];
    let cworkerUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => (
          <Scan role={this.state.role} userId={this.state.userId} />
        )}
      />,
      <Route path={constants.routes.dash.viewData} component={ViewData} />
    ];
    let adminUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => (
          <Scan role={this.state.role} userId={this.state.userId} />
        )}
      />,
      <Route
        path={constants.routes.dash.bucksLanding}
        component={() => <BucksLanding username={this.state.username} />}
      />,
      <Route
        path={constants.routes.dash.manageAccount}
        component={ManageAccount}
      />,
      <Route path={constants.routes.dash.base} render={() => <ViewData />} />,
      <Route
        path={constants.routes.dash.createBucks}
        render={() => <CreateBucks username={this.state.username} />}
      />
    ];

    let ui;
    let label;

    if (this.state.role === "admin") {
      ui = adminUI;
      label = "Food Access Partnership";
    } else if (this.state.role === "caseworker") {
      ui = cworkerUI;
      label = "Partner Organization";
    } else {
      ui = farmerUI;
      label = "Farmer";
    }
    let title;

    if (this.props.location.pathname === "/dash") {
      title = "Scan";
    } else if (this.props.location.pathname === "/dash/manage") {
      title = "Manage Accounts";
    } else if (this.props.location.pathname === "/dash/BucksLanding") {
      title = "Create Bucks";
    } else {
      // TO CHANGE:
      title = "Visualizations";
    }

    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation="push"
          vertical
          visible="true"
          width="wide"
          style={{ height: "100%" }}
        >
          <Menu.Header>
            {/* TODO: */}
            {/* <Image src={logo} size="small" /> */}
            <div
              style={{
                padding: "50px"
              }}
            >
              FAP LOGO GOES HERE
            </div>
          </Menu.Header>
          <Menu.Item as={Link} to={constants.routes.dash.viewBucks}>
            View Data
          </Menu.Item>
          <Menu.Item as={Link} to={constants.routes.dash.manageAccount}>
            Manage Data
          </Menu.Item>
          <Menu.Item as={Link} to={constants.routes.dash.base}>
            Scan
          </Menu.Item>
          <Menu.Item as={Link} to={constants.routes.dash.bucksLanding}>
            Create Bucks
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher style={{ height: "100%" }}>
          <Title>
            <Header
              size="huge"
              textAlign="left"
              style={{
                color: "white",
                position: "absolute",
                top: "150px",
                left: "50px",
                fontSize: "35px"
              }}
            >
              {title}
            </Header>
            <Header
              style={{
                color: "white",
                position: "absolute",
                top: "120px",
                right: "50px"
              }}
            >
              <Icon name="user circle" size="huge" />
              <Header.Content>
                {this.state.username}
                <Header.Subheader
                  style={{
                    color: "white"
                  }}
                >
                  <Label style={{ padding: "0.3em", margin: "0" }}>
                    {label}
                  </Label>
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Title>
          <Container
            style={{
              width: "100%",
              padding: "50px",
              height: "80%",
              "background-color": "#eff0f3"
            }}
          >
            <Router>
              <Switch>{ui}</Switch>
            </Router>
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
