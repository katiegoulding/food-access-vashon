import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import { Container, Header, Divider, Button } from 'semantic-ui-react'

export default class FormSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            doveCount: 0,
            vyfsCount: 0,
            lacomunidadCount: 0,
            validYear: 0
        }
    }

    render() {
        return(
            <div class="ui raised very padded text container segment ten wide column">
                <Header as='h1' textAlign="left">
                    Success!
                    <Header.Subheader>"{this.state.validYear} Buck Set" Created</Header.Subheader>
                </Header>
                <Header as='h5' color='grey' textAlign="left">BUCK ALLOCATION</Header>
                <table class="ui very basic table">

                    <tbody>
                        <tr>
                        <td>Dove</td>
                        <td>150 bucks</td>
                        <td>$300.00</td>
                        </tr>
                        <tr>
                        <td>VYFS: LatinX</td>
                        <td>250 bucks</td>
                        <td>$500.00</td>
                        </tr>
                        <tr>
                        <td>La Comunidad</td>
                        <td>325 bucks</td>
                        <td>$750.00</td>
                        </tr>
                        <tr>
                        <td>Vashon Island Senior Center</td>
                        <td>50 bucks</td>
                        <td>$100.00</td>
                        </tr>
                    </tbody>
                </table>
                {/* should have a divider here */}
                    <Header as='h5' color='grey' textAlign="left">EXPIRATION DATE</Header>

                <Button content='Create New Buck Set'/>
            </div>
        )
    }
}