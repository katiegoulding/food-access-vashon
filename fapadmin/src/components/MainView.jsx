import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import BucksLanding from "./BucksLanding";
import constants from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Scan from "./Scan";
import ManageAccount from "./ManageAccount";
import FarmerPayout from "./FarmerPayout";
import CreateBucks from "./CreateBucks.jsx";
import {
  Image,
  Container,
  Header,
  Icon,
  Label,
  Menu,
  Segment,
  Responsive
} from "semantic-ui-react";
import Dashboard from "./Dashboard";
import Faq from "./Faq";
import logo from '../FAPLogo.png' // relative path to image 

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
  // componentDidMount() {
  //   this.authUnsub = firebase.auth().onAuthStateChanged(user => {
  //     if (!user) {
  //       this.props.history.push(constants.routes.base);
  //     } else {
  //       firebase
  //         .database()
  //         .ref("users/" + user.uid)
  //         .once("value")
  //         .then(snapshot => {
  //           var org = snapshot.val().org;
  //           user.getIdTokenResult(true).then(idTokenResult => {
  //             console.log(idTokenResult.claims.role);
  //             if (idTokenResult.claims.role === "caseworker") {
  //               this.setState({
  //                 username: user.email,
  //                 uid: user.uid,
  //                 role: idTokenResult.claims.role,
  //                 org: org
  //               });
  //             } else {
  //               this.setState({
  //                 username: user.email,
  //                 uid: user.uid,
  //                 role: idTokenResult.claims.role
  //               });
  //             }
  //           });
  //         });
  //     }
  //   });
  // }

  // august componentDidMount() -> does not allow people to route around
  componentDidMount() {
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
      if(!user) {
        this.props.history.push(constants.routes.base);
      } else { //they are authenticated
        user.getIdTokenResult().then(idTokenResult => {
          console.log(idTokenResult.claims.role)
          if(!idTokenResult.claims.role) {
            //their role is null
            //push them to the barrier page
            this.props.history.push(constants.routes.barrier);
          } else {
            //their role has been approved
            firebase
              .database()
              .ref("users/" + user.uid)
              .once("value")
              .then(snapshot => {
                var org = snapshot.val().org;
                this.setState({
                  username: user.email,
                  uid: user.uid,
                  role: idTokenResult.claims.role,
                  org: org
                });
              })
          }
        })
      }
    })
  }

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
      />,
      <Menu.Item
        name="FAQ"
        as={Link}
        to={constants.routes.dash.faq}
        active={this.props.location.pathname === constants.routes.dash.faq}
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
      />,
      <Menu.Item
        name="FAQ"
        as={Link}
        to={constants.routes.dash.faq}
        active={this.props.location.pathname === constants.routes.dash.faq}
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
      />,
      <Menu.Item
        name="FAQ"
        as={Link}
        to={constants.routes.dash.faq}
        active={this.props.location.pathname === constants.routes.dash.faq}
      />
    ];

    let bookkeeperNav = [
      <Menu.Item
        name="Farmer Payout"
        as={Link}
        to={constants.routes.dash.farmerPayout}
        active={
          this.props.location.pathname === constants.routes.dash.farmerPayout
        }
      />,
      <Menu.Item
        name="FAQ"
        as={Link}
        to={constants.routes.dash.faq}
        active={this.props.location.pathname === constants.routes.dash.faq}
    />
    ];

    let farmerUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => <Scan role={this.state.role} userId={this.state.uid} />}
      />,
      <Route
        path={constants.routes.dash.viewData}
        render={() => (
          <Dashboard
            role={this.state.role}
            uid={this.state.uid}
            org={this.state.org}
          />
        )}
      />,
      <Route
        path={constants.routes.dash.faq}
        render={() => (
          <Faq
            role={this.state.role}
          />
        )}
      />
    ];

    let cworkerUI = [
      <Route
        exact
        path={constants.routes.dash.base}
        render={() => <Scan role={this.state.role} userId={this.state.uid} />}
      />,
      <Route
        path={constants.routes.dash.viewData}
        render={() => (
          <Dashboard
            role={this.state.role}
            uid={this.state.uid}
            org={this.state.org}
          />
        )}
      />,
      <Route
        path={constants.routes.dash.faq}
        render={() => (
          <Faq
            role={this.state.role}
          />
        )}
      />
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
      <Route
        path={constants.routes.dash.viewData}
        render={() => (
          <Dashboard
            role={this.state.role}
            uid={this.state.uid}
            org={this.state.org}
          />
        )}
      />,
      <Route
        path={constants.routes.dash.createBucks}
        render={() => <CreateBucks username={this.state.username} />}
      />,
      <Route
        path={constants.routes.dash.faq}
        render={() => (
          <Faq
            role={this.state.role}
          />
        )}
      />
    ];

    let bookkeeperUI = [
      <Route
        path={constants.routes.dash.farmerPayout}
        render={() => <FarmerPayout username={this.state.username} />}
      />,
      <Route
        path={constants.routes.dash.faq}
        render={() => (
          <Faq
            role={this.state.role}
          />
        )}
      />
    ];

    let ui;
    let label;
    let nav;
    let isAdmin;

    if (this.state.role === "admin") {
      ui = adminUI;
      nav = adminNav;
      label = "Food Access Partnership";
      isAdmin = true;
    } else if (this.state.role === "caseworker") {
      ui = cworkerUI;
      nav = cworkerNav;
      label = "Partner Organization";
      isAdmin = false;
    } else if (this.state.role === "farmer") {
      ui = farmerUI;
      nav = farmerNav;
      label = "Farmer";
      isAdmin = false;
    } else if (this.state.role === "bookkeeper") {
      ui = bookkeeperUI;
      nav = bookkeeperNav;
      label = "Bookkeeper";
      isAdmin = false;
    }

    // let title;

    // if (this.props.location.pathname === "/dash") {
    //   title = "View Data";
    // } else if (this.props.location.pathname === "/dash/manage") {
    //   title = "Manage Accounts";
    // } else if (this.props.location.pathname === "/dash/BucksLanding") {
    //   title = "Create a Buck Set";
    // } else if (this.props.location.pathname === "/dash/farmerPayout") {
    //   title = "Farmer Payout";
    // } else if (this.props.location.pathname === "/dash/ViewData") {
    //   title = "View Data";
    // } 

    return (
      <div>
        {/* Regular Header */}

        <Responsive as={Segment} clearing minWidth={768} basic color="blue" inverted padded="very" className="HeaderContainer">
          <Image src={logo} size='small' verticalAlign='bottom' />

          <Header padded="very" size="huge" inverted color='white'>
            VIGA Farm Bucks Dashboard
          </Header>

          <Header floated="right" inverted color='white' className="Header_UserInfo">
            {this.state.username}
            <Header.Subheader inverted color='white'>
              <Label><Icon name='user' /> {label}</Label>
            </Header.Subheader>
          </Header>
        </Responsive>

        {/* Mobile Header */}
        <Responsive as={Segment} maxWidth={767} basic color="blue" inverted padded="very" className="HeaderContainer">
          <Image src={logo} size='small' verticalAlign='bottom' />
          <Header padded="very" size="huge" inverted color='white'>
            VIGA Farm Bucks Dashboard
            <Header.Subheader inverted color='white' className="Header_UserInfo mobile">
              {this.state.username}
              <Label><Icon name='user' /> {label}</Label>
            </Header.Subheader>

          </Header>

          
        </Responsive>
        <Menu secondary stackable={isAdmin} className="NavMenuContainer">
          {nav}
          <Menu.Menu position="right">
            <Menu.Item className="Logout_btn" name="logout" onClick={this.handleSignOut} />
          </Menu.Menu>
        </Menu>

        {
          this.props.location.pathname !== "/dash/ViewData"
          &&
          <Container>
            <Router>
              <Switch>{ui}</Switch>
            </Router>
          </Container>
        }
        {
          this.props.location.pathname === "/dash/ViewData"
          &&
          <Router>
            <Switch>{ui}</Switch>
          </Router>
        }
      </div>
    );
  }
}
