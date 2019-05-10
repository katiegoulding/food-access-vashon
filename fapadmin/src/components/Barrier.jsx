import React from "react";
import firebase from 'firebase/app'
import constants from './constants'
import { Container, Header } from 'semantic-ui-react';
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
            <Container>
                <Header content="Just a moment!"/>
                <Header.Subheader>Your account is pending approval.</Header.Subheader>
            </Container>        
        )
    }
}