import React from 'react';
import 'firebase/auth';
import "firebase/functions"
import 'firebase/database';
import constants from "./constants";
import { Link } from "react-router-dom";
import { Statistic, Header, Divider, Button, Grid, Segment} from 'semantic-ui-react'

export default class FormSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        //const { toggleShowCreateBucks } = this.props
        let sum = this.props.doveCount + this.props.vyfsCount + this.props.lacomunidadCount + this.props.vashonhouseholdCount

        return(
            <Grid.Column width={10}>
                <Segment
                    raised
                    style={{
                    "padding-top": "30px",
                    "padding-right": "40px",
                    "padding-left": "40px"
                    }}
                >
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
                
                <Header as='h5' color='grey' textAlign="left">EXPIRATION DATE</Header>
                <p>{this.props.validYear}</p>

                <Divider hidden />

                <Statistic.Group widths='two'>
                    <Statistic>
                        <Statistic.Value>{sum * 1}</Statistic.Value>
                        <Statistic.Label>VIGA Bucks</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>${2 * sum}.00</Statistic.Value>
                        <Statistic.Label>Dollars</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                
                <Divider hidden />

                <Button content='Create New Buck Set'/>
                
            </Segment>
            </Grid.Column>
        )
    }
}