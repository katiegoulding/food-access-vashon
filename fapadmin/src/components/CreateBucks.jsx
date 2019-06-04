import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/database";
import {
  Statistic,
  Header,
  Button,
  Divider,
  Grid,
  Form,
  Message,
  Segment,
  Container
} from "semantic-ui-react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default class CreateBucks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      complete: false,
      hasError: false,
      errorMessage: ""
    };
  }

  // return true if validated form data is acceptable, false otherwise
  validateFormData = async sum => {
    if (sum <= 0) {
      this.setState({
        errorMessage: "Sum of vouchers in form must be greater than zero."
      });
      return false;
    }

    const { buckSetName } = this.props;
    let buckSetsRef = firebase.database().ref("buckSets");
    let nameExists = false;
    // await the results from firebase, once because this should be done only once the function
    // fires
    await buckSetsRef
      .orderByChild("name")
      .equalTo(buckSetName)
      .once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let childData = childSnapshot.val();
          if (childData.name == buckSetName) {
            this.setState({
              errorMessage: "The buck set name you used already exists."
            });
            nameExists = true;
            // the name exists do nothing
          }
        });
      });
    if (!nameExists) {
      this.props.toggleShowCreateBucks();
    }
  };

  render() {
    const { loading, errorMessage } = this.state;
    let sum =
      this.props.foodbankCount +
      this.props.doveCount +
      this.props.communitycareCount +
      this.props.seniorcenterCount +
      this.props.interfaithCount +
      this.props.communitymealsCount +
      this.props.vashonhouseholdCount +
      this.props.lacomunidadCount +
      this.props.vyfsCount +
      this.props.vyfslatinxCount +
      this.props.vyfsfamilyplaceCount;

    return (
      <Grid.Column width={8}>
        <Segment raised>
          <Container>
            <Form
              // onSubmit={this.handleSubmit}
              onSubmit={this.validateFormData}
              loading={loading}
              error={errorMessage}
            >
              <Form.Input
                inline
                required
                fluid
                transparent
                size="massive"
                placeholder="Buck Set Name"
                value={this.props.buckSetName}
                onInput={evt =>
                  this.props.handleChange({ buckSetName: evt.target.value })
                }
              />

              <Form.Input
                width={8}
                inline
                required
                fluid
                label="Expiration Date"
                type="date"
                value={this.props.expirationDate}
                onInput={evt =>
                  this.props.handleChange({
                    expirationDate: evt.target.value
                  })
                }
              />

              <Header as="h5" color="grey" textAlign="left">
                BUCK ALLOCATION
              </Header>

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="Vashon Community Food Bank"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    foodbankCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="DoVE"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    doveCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="Vashon Community Care"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    communitycareCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="Vashon Senior Center"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    seniorcenterCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="Interfaith Council to Prevent Homelessness"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    interfaithCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="Community Meals"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    communitymealsCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="Vashon Household"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    vashonhouseholdCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="La Communidad \ ECEAP"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    lacomunidadCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="VYFS"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    vyfsCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="VYFS: Latinx"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    vyfslatinxCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Form.Input
                width={6}
                inline
                size="mini"
                fluid
                label="VYFS: Family Place"
                placeholder={0}
                type="number"
                onInput={evt =>
                  this.props.handleChange({
                    vyfsfamilyplaceCount: Number(evt.target.value)
                  })
                }
                min={0}
              />

              <Divider hidden />

              <Statistic.Group widths="two">
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

              {<Button color="blue">Next Step</Button>}

              <Message
                error
                header={errorMessage}
                content={"form not submitted"}
              />
            </Form>
          </Container>
        </Segment>
      </Grid.Column>
    );
  }
}
