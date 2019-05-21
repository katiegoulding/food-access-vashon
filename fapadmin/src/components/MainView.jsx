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
import {
  Container,
  Header,
  Icon,
  Label,
  Menu,
  Segment,
  Responsive
} from "semantic-ui-react";
import Dashboard from "./Dashboard";

// const Title = styled.section`
//   height: 220px;
//   background-image: linear-gradient(to bottom right, #505c86, #404e67);
// `;

//const mql = window.matchMedia(`(min-width: 800px)`);

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      username: "",
      org: ""
      //sidebarDocked: mql.matches,
      //sidebarOpen: false
    };

    //this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    //this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  handleOnUpdate = (e, { width }) => this.setState({ width });

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(this.props.history.push(constants.routes.base));
  };

  componentWillMount() {
    //mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    //mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    //this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    //this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  // anton componentDidMount() -> useful for testing because you can still work if not approved
  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.history.push(constants.routes.base);
      } else {
        user.getIdTokenResult().then(idTokenResult => {
          console.log(idTokenResult.claims.role);
          if (idTokenResult.claims.role === "caseworker") {
            this.setState({
              username: user.email,
              uid: user.uid,
              role: idTokenResult.claims.role,
              org: this.state.org
            });
          } else {
            this.setState({
              username: user.email,
              uid: user.uid,
              role: idTokenResult.claims.role
            });
          }
        });
      }
    });
  }

  // august componentDidMount() -> does not allow people to route around
  // componentDidMount() {
  //   this.authUnsub = firebase.auth().onAuthStateChanged(user => {
  //     if(!user) {
  //       this.props.history.push(constants.routes.base);
  //     } else { //they are authenticated
  //       user.getIdTokenResult().then(idTokenResult => {
  //         console.log(idTokenResult.claims.role)
  //         if(!idTokenResult.claims.role) {
  //           //their role is null
  //           //push them to the barrier page
  //           this.props.history.push(constants.routes.barrier);
  //         } else {
  //           //their role has been approved
  //           this.setState({
  //             username: user.email,
  //             uid: user.uid,
  //             role: idTokenResult.claims.role
  //           });
  //         }
  //       })
  //     }
  //   })
  // }

  render() {
    let farmerNav = [
      <Menu.Item
        name="Scan"
        as={Link}
        to={constants.routes.dash.base}
        active={this.props.location.pathname === constants.routes.dash.base}
      />,
      <Menu.Item
        name="View Data"
        as={Link}
        to={constants.routes.dash.viewData}
        active={this.props.location.pathname === constants.routes.dash.viewData}
      />
    ];
    let cworkerNav = [
      <Menu.Item
        name="Scan"
        as={Link}
        to={constants.routes.dash.base}
        active={this.props.location.pathname === constants.routes.dash.base}
      />,
      <Menu.Item
        name="View Data"
        as={Link}
        to={constants.routes.dash.viewData}
        active={this.props.location.pathname === constants.routes.dash.viewData}
      />
    ];
    let adminNav = [
      <Menu.Item
        name="Create Bucks"
        as={Link}
        to={constants.routes.dash.bucksLanding}
        active={
          this.props.location.pathname === constants.routes.dash.bucksLanding
        }
      />,
      <Menu.Item
        name="Manage Accounts"
        as={Link}
        to={constants.routes.dash.manageAccount}
        active={
          this.props.location.pathname === constants.routes.dash.manageAccount
        }
      />,
      <Menu.Item
        name="View Data"
        as={Link}
        to={constants.routes.dash.viewData}
        active={this.props.location.pathname === constants.routes.dash.viewData}
      />
    ];

    let farmerUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => <Scan role={this.state.role} userId={this.state.uid} />}
      />,
      <Route path={constants.routes.dash.viewData} render={() => <Dashboard role={this.state.role} uid={this.state.uid} org={this.state.org}/>} />
    ];

    let cworkerUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => <Scan role={this.state.role} userId={this.state.uid} />}
      />,
      <Route path={constants.routes.dash.viewData} render={() => <Dashboard role={this.state.role} uid={this.state.uid} org={this.state.org}/>} />
    ];

    let adminUI = [
      <Route
        path={constants.routes.dash.bucksLanding}
        render={() => <BucksLanding username={this.state.username} />}
      />,
      <Route
        path={constants.routes.dash.manageAccount}
        component={ManageAccount}
      />,
      <Route path={constants.routes.dash.base} render={() => <Dashboard role={this.state.role} uid={this.state.uid} org={this.state.org}/>} />,
      <Route
        path={constants.routes.dash.createBucks}
        render={() => <CreateBucks username={this.state.username} />}
      />
    ];

    let ui;
    let label;
    let nav;

    if (this.state.role === "admin") {
      ui = adminUI;
      nav = adminNav;
      label = "Food Access Partnership";
    } else if (this.state.role === "caseworker") {
      ui = cworkerUI;
      nav = cworkerNav;
      label = "Partner Organization";
    } else {
      ui = farmerUI;
      nav = farmerNav;
      label = "Farmer";
    }
    let title;

    if (this.props.location.pathname === "/dash") {
      title = "Scan";
    } else if (this.props.location.pathname === "/dash/manage") {
      title = "Manage Accounts";
    } else if (this.props.location.pathname === "/dash/BucksLanding") {
      title = "Create a Buck Set";
    } else {
      // TO CHANGE:
      title = "Visualizations";
    }

    return (
      <div>
        <Segment basic color="blue" inverted padded="very">
          <Header padded="very" size="huge" floated="left">
            {title}
          </Header>

          <Responsive as={Header} floated="right" {...Responsive.onlyComputer}>
            <Icon name="user circle" size="huge" />
            <Header.Content>
              {this.state.username}
              <Header.Subheader
                style={{
                  color: "white"
                }}
              >
                <Label style={{ padding: "0.3em", margin: "0" }}>{label}</Label>
              </Header.Subheader>
            </Header.Content>
          </Responsive>

          <Responsive as={Header.Subheader} {...Responsive.onlyMobile}>
            <Header.Content>
              {this.state.username}
              <Header.Subheader
                style={{
                  color: "white"
                }}
              >
                <Label style={{ padding: "0.3em", margin: "0" }}>{label}</Label>
              </Header.Subheader>
            </Header.Content>
          </Responsive>
        </Segment>

        {/* remove 'pointing secondary' to change to the alternate style */}
        <Menu stackable secondary>
          {nav}
          <Menu.Menu position="right">
            <Menu.Item name="logout" onClick={this.handleSignOut} />
          </Menu.Menu>
        </Menu>

        <Container
          style={{
            width: "100%",
            padding: "50px",
            height: "calc(100% - 220px)  !important",
            backgroundColor: "#eff0f3"
          }}
        >
          <Router>
            <Switch>{ui}</Switch>
          </Router>
        </Container>
      </div>
    );
  }
}
