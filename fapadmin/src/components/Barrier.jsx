import React from "react";
import firebase from 'firebase/app'
import constants from './constants'
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
import "firebase/auth";
import "firebase/database";

export default class Barrier extends React.Component {

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult().then(idTokenResult => {
                    if(idTokenResult.claims.role) {
                        //push them on to the dashboard
                        this.props.history.push(constants.routes.dash.base);
                    }
                });
            }
        });
    }

    render() {
        return ( 
            <Grid centered="true">
                <Grid.Column width={6} verticalAlign="middle" textAlign="center">
                <Segment inverted color="olive">
                    <Icon name="hand paper outline" size="huge"></Icon>
                    <Header inverted as="h1" content="Your account is pending approval."/>
                    <Header.Subheader>Once your account is approved this page will automatically update.</Header.Subheader>
                    <p>Please contact foodaccesspartnership@vigavashon.org with account inquiries.</p>
                </Segment>
                </Grid.Column>
            </Grid>        
        )
    }
}