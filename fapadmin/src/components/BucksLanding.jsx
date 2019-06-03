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
      foodbankCount: 0,
      doveCount: 0,
      communitycareCount: 0,
      seniorcenterCount: 0,
      interfaithCount: 0,
      communitymealsCount: 0,
      vashonhouseholdCount: 0,
      lacomunidadCount: 0,
      vyfsCount: 0,
      vyfslatinxCount: 0,
      vyfsfamilyplaceCount: 0,
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
            {this.state.showCreateBucks ? (
              <CreateBucks
                toggleShowCreateBucks={this.toggleShowCreateBucks}
                handleChange={this.handleChange}
                buckSetName={this.state.buckSetName}
                username={this.props.username}
                foodbankCount={this.state.foodbankCount}
                doveCount={this.state.doveCount}
                communitycareCount={this.state.communitycareCount}
                seniorcenterCount={this.state.seniorcenterCount}
                interfaithCount={this.state.interfaithCount}
                communitymealsCount={this.state.communitymealsCount}
                vashonhouseholdCount={this.state.vashonhouseholdCount}
                lacomunidadCount={this.state.lacomunidadCount}
                vyfsCount={this.state.vyfsCount}
                vyfslatinxCount={this.state.vyfslatinxCount}
                vyfsfamilyplaceCount={this.state.vyfsfamilyplaceCount}
                expirationDate={this.state.expirationDate}
              />
            ) : (
              <FormSuccess
                toggleShowCreateBucks={this.toggleShowCreateBucks}
                buckSetName={this.state.buckSetName}
                username={this.props.username}
                foodbankCount={this.state.foodbankCount}
                doveCount={this.state.doveCount}
                communitycareCount={this.state.communitycareCount}
                seniorcenterCount={this.state.seniorcenterCount}
                interfaithCount={this.state.interfaithCount}
                communitymealsCount={this.state.communitymealsCount}
                vashonhouseholdCount={this.state.vashonhouseholdCount}
                lacomunidadCount={this.state.lacomunidadCount}
                vyfsCount={this.state.vyfsCount}
                vyfslatinxCount={this.state.vyfslatinxCount}
                vyfsfamilyplaceCount={this.state.vyfsfamilyplaceCount}
                expirationDate={this.state.expirationDate}
              />
            )}
            <ViewBucks />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
