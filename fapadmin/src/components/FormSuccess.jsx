import React from "react";
import "firebase/auth";
import "firebase/functions";
import "firebase/database";
import firebase from "firebase/app";
import constants from "./constants";
import { Link } from "react-router-dom";
import {
  Statistic,
  Header,
  Divider,
  Button,
  Grid,
  Segment
} from "semantic-ui-react";
import bgImg from "../bucktemplateprintpage.jpg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class FormSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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

  // On submit of the Create Voucher form the function saves given data to
  // Firebase and calls postData to Google Cloud Function to generate pdf
  handleSubmit = async event => {
    event.preventDefault();
    const {
      foodbankCount,
      doveCount,
      communitycareCount,
      seniorcenterCount, 
      interfaithCount,
      communitymealsCount,
      vashonhouseholdCount,
      lacomunidadCount,
      vyfsCount,
      vyfslatinxCount,
      vyfsfamilyplaceCount,
    } = this.props;

    this.setState({
      loading: true
    });

    let sum = foodbankCount +
    doveCount +
    communitycareCount +
    seniorcenterCount + 
    interfaithCount +
    communitymealsCount +
    vashonhouseholdCount +
    lacomunidadCount +
    vyfsCount +
    vyfslatinxCount +
    vyfsfamilyplaceCount

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
    //const { toggleShowCreateBucks } = this.props
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
      <Grid.Column width={10}>
        <Segment
          raised
          style={{
            "padding-top": "30px",
            "padding-right": "40px",
            "padding-left": "40px"
          }}
        >
          <Header as="h1" textAlign="left">
            Success!
            <Header.Subheader>
              "{this.props.buckSetName}" Buck Set Created
            </Header.Subheader>
          </Header>
          <Header as="h5" color="grey" textAlign="left">
            BUCK ALLOCATION
          </Header>
          <table class="ui very basic table">
            <tbody>
            <tr>
                <td>Vashon Community Food Bank</td>
                <td>{this.props.foodbankCount} bucks</td>
                <td>${this.props.foodbankCount * 2}.00</td>
              </tr>
              <tr>
                <td>DoVE</td>
                <td>{this.props.doveCount} bucks</td>
                <td>${this.props.doveCount * 2}.00</td>
              </tr>
              <tr>
                <td>Vashon Community Care</td>
                <td>{this.props.communitycareCount} bucks</td>
                <td>${this.props.communitycareCount * 2}.00</td>
              </tr>
              <tr>
                <td>Vashon Senior Center</td>
                <td>{this.props.seniorcenterCount} bucks</td>
                <td>${this.props.seniorcenterCount * 2}.00</td>
              </tr>
              <tr>
                <td>Interfaith Council to Prevent Homelessness</td>
                <td>{this.props.interfaithCount} bucks</td>
                <td>${this.props.interfaithCount * 2}.00</td>
              </tr>
              <tr>
                <td>Community Meals</td>
                <td>{this.props.communitymealsCount} bucks</td>
                <td>${this.props.communitymealsCount * 2}.00</td>
              </tr>
              <tr>
                <td>Vashon Household</td>
                <td>{this.props.vashonhouseholdCount} bucks</td>
                <td>${this.props.vashonhouseholdCount * 2}.00</td>
              </tr>
              <tr>
                <td>La Communidad \ ECEAP</td>
                <td>{this.props.lacomunidadCount} bucks</td>
                <td>${this.props.lacomunidadCount * 2}.00</td>
              </tr>
              <tr>
                <td>VYFS</td>
                <td>{this.props.vyfsCount} bucks</td>
                <td>${this.props.vyfsCount * 2}.00</td>
              </tr>
              <tr>
                <td>VYFS: Latinx</td>
                <td>{this.props.vyfslatinxCount} bucks</td>
                <td>${this.props.vyfslatinxCount * 2}.00</td>
              </tr>
              <tr>
                <td>VYFS: Family Place</td>
                <td>{this.props.vyfsfamilyplaceCount} bucks</td>
                <td>${this.props.vyfsfamilyplaceCount * 2}.00</td>
              </tr>
            </tbody>
          </table>

          <Header as="h5" color="grey" textAlign="left">
            EXPIRATION DATE
          </Header>
          <p>{this.props.expirationDate}</p>

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

          <Button content="Generate PDF for Print" onClick={this.handleSubmit} />
        </Segment>
      </Grid.Column>
    );
  }
}
