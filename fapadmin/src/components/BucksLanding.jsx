import React from 'react';
import ViewBucks from './ViewBucks';
import CreateBucks from './CreateBucks';
import { Button } from 'semantic-ui-react'

export default class BucksLanding extends React.Component {

    constructor(props) {
        super(props)
        this.toggleShowCreateBucks = this.toggleShowCreateBucks.bind(this)
        this.state = {
            showCreateBucks: false
        }
    }

    toggleShowCreateBucks(_event) {
        this.setState({
            showCreateBucks: true
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
                    this.state.showCreateBucks ? <CreateBucks /> : <ViewBucks />
                }
            </div>
        )
    }

}