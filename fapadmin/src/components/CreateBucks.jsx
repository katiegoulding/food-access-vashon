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
import bgImg from "../bucktemplateprintpage.jpg";
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

  //TODO: errorMessage (a string) should be replaced with hasError (a boolean) in the form props.

  toDataURL(src, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }

  // NAME CHANGE: year changed to expirationDate
  createPDF(data) {
    let ids = data.ids;
    let expirationDate = data.expirationDate;

    var documentDefinition = {
      content: []
    };

    documentDefinition.content.pageSize = "LETTER";

    // PDF VARIABLES(in mm):

    var count = 1;

    ids.forEach(id => {
      console.log(id);
      let pOrg = id.partnerOrg;
      let code = id.id;
      let qr;
      if (count % 4 == 0 && count !== ids.length) {
        qr = {
          qr: code,
          fit: 50,
          margin: [381, 0, 0, 137],
          pageBreak: "after"
        };
      } else if (count % 4 == 1) {
        qr = { qr: code, fit: 50, margin: [381, 51, 0, 137] };
      } else {
        qr = { qr: code, fit: 50, margin: [381, 0, 0, 137] };
      }
      console.log(JSON.stringify(qr));
      documentDefinition.content.push(qr);
      count++;
    });

    documentDefinition.pageMargins = [0, 0, 0, 0];

    return documentDefinition;
  }

  // takes organization name, voucher count, and a list of ids and saves them in the Firebase Realtime database
  postVoucherData(organization, count, ids) {
    let updates = {};

    for (let i = 0; i < count; i++) {
      let voucherData = {
        organization,
        createdOn: new Date(),
        expirationDate: this.props.expirationDate
      };

      let newVoucherKey = firebase
        .database()
        .ref()
        .child("vouchers")
        .push().key;
      ids.push({ partnerOrg: organization, id: newVoucherKey });

      firebase
        .database()
        .ref()
        .child("vis2/" + organization + "/created/")
        .update({
          [newVoucherKey]: new Date()
        });

      updates["/vouchers/" + newVoucherKey] = voucherData;
    }

    return firebase
      .database()
      .ref()
      .update(updates);
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

    let isTrue = true;
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
            isTrue = false;
          }
        });
      });
    return isTrue;
  };

  // On submit of the Create Voucher form the function saves given data to
  // Firebase and calls postData to Google Cloud Function to generate pdf
  handleSubmit = async event => {
    event.preventDefault();
    const {
      doveCount,
      vyfsCount,
      lacomunidadCount,
      vashonhouseholdCount
    } = this.props;

    this.setState({
      loading: true
    });

    let sum = doveCount + vyfsCount + lacomunidadCount + vashonhouseholdCount;
    // await to do a lookup in firebase if the name they're using has been used already
    let isValid = await this.validateFormData(sum);
    if (!isValid) {
      this.setState({
        loading: false
      });
      return;
    } else {
      this.setState({
        errorMessage: ""
      });
    }

    // Add the new buck set to the list of buckSets in Firebase
    const promiseFromFirebase = firebase
      .database()
      .ref()
      .child("buckSets/" + this.props.buckSetName)
      .update({
        name: this.props.buckSetName,
        createdOn: new Date(),
        createdBy: this.props.username,
        expirationDate: this.props.expirationDate,
        foodbankCount: this.props.foodbankCount,
        doveCount: this.props.doveCount,
        communitycareCount: this.props.communitycareCount,
        seniorcenterCount: this.props.seniorcenterCount,
        interfaithCount: this.props.interfaithCount,
        communitymealsCount: this.props.communitymealsCount,
        vashonhouseholdCount: this.props.vashonhouseholdCount,
        lacomunidadCount: this.props.lacomunidadCount,
        vyfsCount: this.props.vyfsCount,
        vyfslatinxCount: this.props.vyfslatinxCount,
        vyfsfamilyplaceCount: this.props.vyfsfamilyplaceCount
      });

    promiseFromFirebase
      .then(data => {
        console.log("Buckset upload passed");
      })
      .catch(err => {
        console.log("Buckset upload failed with: ", err);
      });

    //post the data, wait on each one to resolve
    let ids = [];
    let promise1 = this.postVoucherData("dove", doveCount, ids);
    let promise2 = this.postVoucherData("vyfs", vyfsCount, ids);
    let promise3 = this.postVoucherData("lacomunidad", lacomunidadCount, ids);
    let promise4 = this.postVoucherData(
      "vashonhousehold",
      vashonhouseholdCount,
      ids
    );

    // prepare data for post to Google Cloud Function
    let data = {
      expirationDate: this.props.expirationDate,
      ids
    };

    // Call Google Cloud Function to generate PDF of vouchers
    Promise.all([promise1, promise2, promise3, promise4])
      .then(doesPass => {
        let documentDefinition = this.createPDF(data);
        this.toDataURL(bgImg, dataUrl => {
          documentDefinition.background = [
            {
              image: dataUrl,
              width: 612.0,
              height: 792.0
            }
          ];
          console.log(JSON.stringify(documentDefinition));
          pdfMake
            .createPdf(documentDefinition)
            .download(this.props.buckSetName + ".pdf", () => {
              this.setState({
                complete: true,
                loading: false,
                errorMessage: ""
              });
              const { toggleShowCreateBucks } = this.props;
              toggleShowCreateBucks();
            });
        });
      })
      .catch(err => {
        console.log("Error on firebase request", err);
        this.setState({
          errorMessage: "Error on firebase request"
        });
      });
    console.log("firebase.functions() = ", firebase.functions());
  };

  render() {
    const { loading, errorMessage } = this.state;
    const { toggleShowCreateBucks } = this.props;
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
      this.props.vyfsfamilyplaceCount

    return (
      <Grid.Column width={10} >

        <Segment className="master_modal_container">

        <Container className="modal_container">
          <Form
            // onSubmit={this.handleSubmit}
            onSubmit={toggleShowCreateBucks}
            loading={loading}
            error={errorMessage}>

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
              className="buck_set_name_input"
            />

            <Form.Input
              width={9}
              inline
              required
              fluid
              label="Expiration Date"
              type="date"
              className="expiration_date_container"
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

            <Statistic.Group widths="two" className="statistics_big_numbers">
              <Statistic>
                <Statistic.Value className="statistic_number">{sum * 1}</Statistic.Value>
                <Statistic.Label>VIGA Bucks</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value className="statistic_number">${2 * sum}.00</Statistic.Value>
                <Statistic.Label>Dollars</Statistic.Label>
              </Statistic>
            </Statistic.Group>

            <Divider hidden />

            <Form.Input
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
              width={16}
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
