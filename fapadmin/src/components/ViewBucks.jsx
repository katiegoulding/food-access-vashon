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
        createdBy: value.createdBy
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
      this.setState({
        firebaseBuckSet
      });
    });
  }

    render () {
            return (
            <Grid.Column width={6}>
                <Container>
                <Header as='h2'>Existing Buck Sets</Header>
                <Card.Group className="existing_buck_set_container">
                    {
                        //for each item in the data provided, map will create a BuckSetListItem
                        //that has the respective title and subtitle
                        this.state.firebaseBuckSet.map(
                            (element) => {
                                return (
                                    <BuckSetListItem key={element.name + element.createdBy} data={element}/>
                                )
                            }
                        )
                    }
                </Card.Group>
                </Container>
            </Grid.Column>
        )
    }
}
