import React from "react";
import "firebase/auth";
import "firebase/functions";
import "firebase/database";
import firebase from "firebase/app";
import {
  Statistic,
  Progress,
  Header,
  Divider,
  Button,
  Grid,
  Segment
} from "semantic-ui-react";
import bgImg from "../farmBuckEnglish.jpg";
import bgImgSP from "../farmBuckSpanish.jpg";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const orgID = {
  foodbank: "A-1",
  dove: "A-2",
  vcc: "A-3",
  seniorcenter: "A-4",
  interfaith: "A-5",
  communitymeals: "A-6",
  vashonhousehold: "A-7",
  lacomunidad: "A-8",
  vyfs: "A-9",
  vyfslatinx: "A-10",
  vyfsfamily: "A-11"
};

export default class FormSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      progressLabel: "generating PDF...",
      downloadComplete: false,
      percent: 20
    };
  }

  toDataURL = (src, callback, outputFormat) => {
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
      callback(dataURL)
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }

  createPDF(data, dataURL, dataURLSP) {
    let ids = data.ids;
    let expirationDate = data.expirationDate;
    let dateObj = new Date(expirationDate)
    let year = expirationDate.split('-')[0]

    var documentDefinition = {
      content: []
    };

    documentDefinition.pageSize = "LETTER";

    // PDF VARIABLES(in mm):

    var count = 1;

    for (var i = 0; i < ids.length; i++) {
      let id = ids[i];
      let pOrgID = orgID[id.partnerOrg];
      let code = id.id;
      let qr;
      let exp = {
        text: "Expires: " + expirationDate,
        absolutePosition: { x: 395, y: 198 * (i % 4) + 141 },
        fontSize: 7,
        color: "white",
        bold: true
      };
      let yearText = {
        text: year,
        absolutePosition: { x: 391, y: 198 * (i % 4) + 171 },
        fontSize: 4,
        color: "#5f605f",
        bold: true
      };
      let coupon = {
        image: dataURL,
        height: 198,
        width: 455,
        absolutePosition: { x: 78.5, y: 198 * (i % 4) }
      };
      let org = {
        text: pOrgID,
        absolutePosition: { x: 386, y: 198 * (i % 4) + 158 },
        fontSize: 12,
        color: "#5f605f",
        bold: true
      };

      documentDefinition.content.push(coupon);
      documentDefinition.content.push(exp);
      documentDefinition.content.push(org);
      documentDefinition.content.push(yearText);

      if (count % 4 === 0 || count === ids.length) {
        qr = {
          qr: code,
          fit: 50,
          absolutePosition: { x: 390, y: 198 * (i % 4) + 44 },
          pageBreak: "after"
        };
        documentDefinition.content.push(qr);
        if (count % 4 === 0) {
          if (count === ids.length) {
            this.generateSpanishPage(documentDefinition, dataURLSP, 4, true);
          } else {
            this.generateSpanishPage(documentDefinition, dataURLSP, 4, false);
          }
        } else {
          if (count === ids.length) {
            this.generateSpanishPage(
              documentDefinition,
              dataURLSP,
              count % 4,
              true
            );
          } else {
            this.generateSpanishPage(
              documentDefinition,
              dataURLSP,
              count % 4,
              false
            );
          }
        }
      } else {
        qr = {
          qr: code,
          fit: 50,
          absolutePosition: { x: 390, y: 198 * (i % 4) + 44 }
        };
        documentDefinition.content.push(qr);
      }
      count++;
    }

    documentDefinition.pageMargins = [0, 0, 0, 0];

    return documentDefinition;
  }

  generateSpanishPage(doc, spURL, count, end) {
    for (let i = 0; i < count - 1; i++) {
      let coupon = {
        image: spURL,
        height: 198,
        width: 455,
        absolutePosition: { x: 78.5, y: 198 * (i % 4) }
      };
      doc.content.push(coupon);
    }
    if (end) {
      doc.content.push({
        image: spURL,
        height: 198,
        width: 455,
        absolutePosition: { x: 78.5, y: 198 * (count - 1) }
      });
    } else {
      doc.content.push({
        image: spURL,
        height: 198,
        width: 455,
        absolutePosition: { x: 78.5, y: 198 * (count - 1) },
        pageBreak: "after"
      });
    }
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
      isLoading: true
    });

    // DB has a table of buckSets
    // DB has a table of individual vouchers/{key}/

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
      .then(_data => {
        console.log("Buckset upload passed");
        this.setState({
          percent: 50
        })
      })
      .catch(err => {
        console.log("Buckset upload failed with: ", err);
      });

    //post the data, wait on each one to resolve
    let ids = [];
    let promises = [
      this.postVoucherData("foodbank", foodbankCount, ids),
      this.postVoucherData("dove", doveCount, ids),
      this.postVoucherData("vcc", communitycareCount, ids),
      this.postVoucherData("seniorcenter", seniorcenterCount, ids),
      this.postVoucherData("interfaith", interfaithCount, ids),
      this.postVoucherData("communitymeals", communitymealsCount, ids),
      this.postVoucherData("vashonhousehold", vashonhouseholdCount, ids),
      this.postVoucherData("lacomunidad", lacomunidadCount, ids),
      this.postVoucherData("vyfs", vyfsCount, ids),
      this.postVoucherData("vyfslatinx", vyfslatinxCount, ids),
      this.postVoucherData("vyfsfamily", vyfsfamilyplaceCount, ids),
    ]
    // prepare data for post to Google Cloud Function
    let data = {
      expirationDate: this.props.expirationDate,
      ids
    };

    Promise.all(promises)
      .then(_doesPass => {
        this.toDataURL(bgImgSP, dataUrlSP => {
          this.toDataURL(bgImg, dataUrl => {
            let documentDefinition = this.createPDF(data, dataUrl, dataUrlSP);
            pdfMake
              .createPdf(documentDefinition)
              .download(this.props.buckSetName + ".pdf", () => {
                this.setState({
                  complete: true,
                  progressLabel: "Complete!",
                  downloadComplete: true,
                  percent: 100,
                  errorMessage: ""
                }, () => {
                  setTimeout(
                    () => {
                      this.setState({
                        isLoading: true
                      })
                    }, 
                    5000
                  )
                }
                );
              })
          });
        })
    }).catch(err => {
        console.log("Error on firebase request", err);
        this.setState({
          errorMessage: "Error on firebase request",
          isLoading: false
        });
      })
  };

  render() {
    const { toggleShowCreateBucks } = this.props
    const { progressLabel, downloadComplete } = this.state

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

    console.log('loading = ', this.state.isLoading)
    return (
      <Grid.Column width={10}>
        <Segment
          raised
          style={{
            paddingTop: "30px",
            paddingRight: "40px",
            paddingLeft: "40px"
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
          <table className="ui very basic table">
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



          {
            this.state.isLoading ?
            <Progress percent={this.state.percent} active color='blue' success={downloadComplete} label={progressLabel}/> 
            : 
            <Button.Group>
              <Button content="Generate PDF for Print" onClick={this.handleSubmit} />
              <Button.Or />
              <Button content="Discard Buck Set" onClick={toggleShowCreateBucks} />
            </Button.Group>
          }
        </Segment>
      </Grid.Column>
    );
  }
}
