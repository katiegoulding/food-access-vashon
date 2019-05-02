import React from 'react';
import ViewBucks from './ViewBucks';
import CreateBucks from './CreateBucks';
import { Button } from 'semantic-ui-react'
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
                {!this.state.showCreateBucks
                    &&
                    <Button content='Create New Buck Set' onClick={this.toggleShowCreateBucks} />
                }
                {
                    this.state.showCreateBucks ? <CreateBucks toggleShowCreateBucks={this.toggleShowCreateBucks} /> : <FormSuccess toggleShowCreateBucks={this.toggleShowCreateBucks} />
                }
                <ViewBucks/>
            </div>
        )
    }

}