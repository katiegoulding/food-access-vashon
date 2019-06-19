import React from "react";
import BuckSetListItem from "./BuckSetListItem.jsx";
import { Header, Container, Grid, Card } from "semantic-ui-react";
import firebase from "firebase/app";

export default class ViewBucks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseBuckSet: []
    };
  }

  componentDidMount() {
    let firebaseBuckSet = [];

    let buckSetsRef = firebase.database().ref("buckSets");
    buckSetsRef.orderByChild("createdOn").on("child_added", snapshot => {
      const value = snapshot.val();
      // sort by newest
      firebaseBuckSet.push({
        name: value.name,
        createdBy: value.createdBy,
        createdOn: value.createdOn,
        expirationDate: value.expirationDate,
        communitycareCount: value.communitycareCount,
        communitymealsCount: value.communitymealsCount,
        doveCount: value.doveCount,
        foodbankCount: value.foodbankCount,
        interfaithCount: value.interfaithCount,
        lacomunidadCount: value.lacomunidadCount,
        seniorcenterCount: value.seniorcenterCount,
        vashonhouseholdCount: value.vashonhouseholdCount,
        vyfsCount: value.vyfsCount,
        vyfsfamilyplaceCount: value.vyfsfamilyplaceCount,
        vyfslatinxCount: value.vyfslatinxCount
      });
      this.setState({
        firebaseBuckSet
      });
    });

    console.log("in componnent did mount in ViewBucks")
    buckSetsRef.orderByChild("createdOn").on("child_removed", snapshot => {
      const value = snapshot.val();
      // filter out the removed item and force another render
      firebaseBuckSet = firebaseBuckSet.filter(
        el => !(el.title === value.name && el.subtitle === value.createdBy)
      );

      //added b/c I think this became undefined
      if(firebaseBuckSet) {
        this.setState({
          firebaseBuckSet
        });
      }
    });
  }

  render() {
    return (
      <Grid.Column width={6}>
        <Container>
          <Header as="h2">Existing Buck Sets</Header>

          <Card.Group>
            { this.state.firebaseBuckSet.length === 0 ?
            <Card fluid>
              <Card.Content>
                  <Card.Meta>Nothing to show here!</Card.Meta>
              </Card.Content>
            </Card>
            :
            //for each item in the data provided, map will create a BuckSetListItem
            //that has the respective title and subtitle
            this.state.firebaseBuckSet.map(element => {
              return (
                <BuckSetListItem
                  key={element.name + 
                    element.createdBy + 
                    element.createdOn +
                    element.expirationDate +
                    element.communitycareCount +
                    element.communitymealsCount +
                    element.doveCount +
                    element.foodbankCount +
                    element.interfaithCount +
                    element.lacomunidadCount +
                    element.seniorcenterCount +
                    element.vashonhouseholdCount +
                    element.vyfsCount +
                    element.vyfsfamilyplaceCount +
                    element.vyfslatinxCount
                  }
                  data={element}
                />
              );
            })}
          </Card.Group>
        </Container>
      </Grid.Column>
    );
  }
}
