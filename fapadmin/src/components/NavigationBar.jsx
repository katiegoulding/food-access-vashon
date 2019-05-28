import React from 'react'
import { Link } from "react-router-dom";
import constants from "./constants";
import firebase from 'firebase/app';
import 'firebase/auth';
import { Menu } from 'semantic-ui-react'


export default class NavigationBar extends React.Component {

    handleSignOut = () => {
        firebase
          .auth()
          .signOut()
          .then(this.props.history.push(constants.routes.base));
      }
      
    render() {
        let farmerUI = [
            <Menu.Item
                name="Scan"
                as={Link}
                to={constants.routes.dash.base}
                //active={this.props.location.pathname === constants.routes.dash.base}
              />,
              <Menu.Item
                name='View Data'
                as={Link}
                to={constants.routes.dash.viewData}
                //active={this.props.location.pathname === constants.routes.dash.viewData}
              />
        ];
        let cworkerUI = [
            <Menu.Item
                name="Scan"
                as={Link}
                to={constants.routes.dash.base}
                //active={this.props.location.pathname === constants.routes.dash.base}
              />,
              <Menu.Item
                name='View Data'
                as={Link}
                to={constants.routes.dash.viewData}
                //active={this.props.location.pathname === constants.routes.dash.viewData}
              />
        ];
        let adminUI = [
            <Menu.Item
                name='Create Bucks'
                as={Link}
                to={constants.routes.dash.bucksLanding}
                //active={this.props.location.pathname ===constants.routes.dash.bucksLanding}
              />,
              <Menu.Item
                name="Scan"
                as={Link}
                to={constants.routes.dash.base}
                //active={this.props.location.pathname === constants.routes.dash.base}
              />,
              <Menu.Item
                name='Manage Accounts'
                as={Link}
                to={constants.routes.dash.manageAccount}
                //active={this.props.location.pathname ===constants.routes.dash.manageAccount}
              />,
              <Menu.Item
                name='View Data'
                as={Link}
                to={constants.routes.dash.viewData}
                //active={this.props.location.pathname ===constants.routes.dash.viewData}
              />
        ];

        let ui;

        if (this.props.role === 'admin') {
            ui = adminUI;
        } else if (this.props.role === 'caseworker') {
            ui = cworkerUI;
        } else {
            ui = farmerUI;
        }

        let divStyle = {
            paddingBottom: "20px"
        }

        return (
            <Menu stackable secondary>
                {ui}
                <Menu.Menu position='right'>
                <Menu.Item
                        name='logout'
                        onClick={this.handleSignOut}
                    />
                </Menu.Menu>
            </Menu>
        )
    }
}