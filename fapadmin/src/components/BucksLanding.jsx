import React from 'react';
import ViewBucks from './ViewBucks';
import CreateBucks from './CreateBucks';

export default class BucksLanding extends React.Component {

    constructor(props) {
        super(props)
        this.toggleShowCreateBucks = this.toggleShowCreateBucks.bind(this)
        this.state = { 
            showCreateBucks: false
        }
    }

    toggleShowCreateBucks (_event) {
        this.setState({
            showCreateBucks: true
        })
    }


    render() {
        return (
            <div> 
                {!this.state.showCreateBucks
                    && 
                    <button onClick={this.toggleShowCreateBucks} type="submit">
                        Create New Buck Set
                    </button>
                }
                {
                    this.state.showCreateBucks ?  <CreateBucks/> : <ViewBucks/>
                }
            </div>
        )
    }

}