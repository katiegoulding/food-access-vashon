import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import { Container, Header, Divider, Button, Grid } from 'semantic-ui-react'

export default class FormSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return(
            <div class="ui raised very padded container segment">
                <Header as='h1' textAlign="left">
                    Success!
                    <Header.Subheader>"{this.props.buckSetName}" Buck Set Created</Header.Subheader>
                </Header>
                <Header as='h5' color='grey' textAlign="left">BUCK ALLOCATION</Header>
                <table class="ui very basic table">

                    <tbody>
                        <tr>
                        <td>Dove</td>
                        <td>{this.props.doveCount} bucks</td>
                        <td>${this.props.doveCount * 2}.00</td>
                        </tr>
                        <tr>
                        <td>VYFS: LatinX</td>
                        <td>{this.props.vyfsCount} bucks</td>
                        <td>${this.props.vyfsCount * 2}.00</td>
                        </tr>
                        <tr>
                        <td>La Comunidad</td>
                        <td>{this.props.lacomunidadCount} bucks</td>
                        <td>${this.props.lacomunidadCount * 2}.00</td>
                        </tr>
                        <tr>
                        <td>Vashon Household</td>
                        <td>{this.props.vashonhouseholdCount} bucks</td>
                        <td>${this.props.vashonhouseholdCount * 2}.00</td>
                        </tr>
                    </tbody>
                </table>
                {/* should have a divider here */}
                    <Header as='h5' color='grey' textAlign="left">{this.props.validYear}</Header>

                <Button content='Create New Buck Set'/>
            </div>
        )
    }
}