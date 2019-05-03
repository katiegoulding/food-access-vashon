import React from 'react';
import ViewBucks from './ViewBucks';
import CreateBucks from './CreateBucks';
import { Button, Grid } from 'semantic-ui-react'
import FormSuccess from './FormSuccess';

export default class BucksLanding extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showCreateBucks: true
        }
        this.toggleShowCreateBucks = this.toggleShowCreateBucks.bind(this)
    }

    toggleShowCreateBucks(_event) {
        this.setState({
            showCreateBucks: !this.state.showCreateBucks
        })
    }


    render() {
        return (
            
            <div>
                <Grid centered>
                <Grid.Row>
                    {!this.state.showCreateBucks}
                    {
                        this.state.showCreateBucks ? <CreateBucks toggleShowCreateBucks={this.toggleShowCreateBucks} /> : <FormSuccess toggleShowCreateBucks={this.toggleShowCreateBucks} />
                    }
                    <ViewBucks/>
                </Grid.Row>
                </Grid>
            </div>
        )
    }

}