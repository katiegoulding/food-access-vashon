import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import MainActivity from "./MainActivity.jsx";
import BucksLanding from "./BucksLanding";
import NavigationBar from './NavigationBar';
import constants from "./constants";

export default class MainView extends React.Component {

    render () {
        return (
            <div>
                <h1>Website Title</h1>
                <NavigationBar/>
                <Router>
                    <Switch>
                        {/* <Route path={constants.routes.dash.base} component={MainActivity}/> */}
                        <Route path={constants.routes.dash.viewData} component={MainActivity}/>
                        <Route path={constants.routes.dash.createBucks} component={BucksLanding}/>
                    </Switch>
                </Router>
                <button
                    type="submit"
                    className="btn btn-danger col-1"
                    onClick={() => this.handleSignOut()}>
                    Sign Out
                </button>
            </div>
        )
    }
}