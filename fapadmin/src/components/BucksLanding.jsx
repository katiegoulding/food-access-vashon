import React from "react";
import ViewBucks from "./ViewBucks";
import CreateBucks from "./CreateBucks";
import { Grid, Container } from "semantic-ui-react";
import FormSuccess from "./FormSuccess";

export default class BucksLanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateBucks: true,
      buckSetName: "",
      doveCount: 0,
      vyfsCount: 0,
      lacomunidadCount: 0,
      vashonhouseholdCount: 0,
      expirationDate: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleShowCreateBucks = this.toggleShowCreateBucks.bind(this);
  }

  handleChange(newState) {
    this.setState(newState);
  }

  toggleShowCreateBucks(_event) {
    this.setState({
      showCreateBucks: !this.state.showCreateBucks
    });
  }

  render() {
      return (
          <Container>
              <Grid stackable centered>
              <Grid.Row>
                  {
                      this.state.showCreateBucks ?
                          <CreateBucks 
                              toggleShowCreateBucks={this.toggleShowCreateBucks}
                              handleChange={this.handleChange}
                              buckSetName={this.state.buckSetName}
                              username={this.props.username}
                              doveCount={this.state.doveCount}
                              vyfsCount={this.state.vyfsCount}
                              lacomunidadCount={this.state.lacomunidadCount}
                              vashonhouseholdCount={this.state.vashonhouseholdCount}
                              expirationDate={this.state.expirationDate}
                          />
                          : 
                          <FormSuccess 
                              toggleShowCreateBucks={this.toggleShowCreateBucks}
                              buckSetName={this.state.buckSetName}
                              doveCount={this.state.doveCount}
                              vyfsCount={this.state.vyfsCount}
                              lacomunidadCount={this.state.lacomunidadCount}
                              vashonhouseholdCount={this.state.vashonhouseholdCount}
                              expirationDate={this.state.expirationDate}
                          />
                  }
                  <ViewBucks/>
              </Grid.Row>
              </Grid>
          </Container>
      )
  }

}
