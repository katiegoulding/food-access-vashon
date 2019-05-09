import React from "react";
<<<<<<< HEAD
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import QrReader from 'react-qr-reader'
import { Container, Divider, Header, Responsive, Grid, Segment } from 'semantic-ui-react'


=======
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import QrReader from "react-qr-reader";
import { Header, Container, Grid, Segment } from "semantic-ui-react";
>>>>>>> 82cb1d32f667bd8d086f011327cd7045e42dfe5c
export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "No result",
      legacyMode: false
    };
  }

  handleScan = data => {
    data = JSON.parse(data);
    if (data) {
      this.setState({
        result: data
      });
    }
  };
  handleError = err => {
    console.error(err);
    this.setState({
      legacyMode: true
    });
  };

  render() {
    let scanner;

<<<<<<< HEAD
    render() {
        let scanner;

        if (this.state.legacyMode) {
            scanner = <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '50%', margin: 'auto' }}
                legacyMode
            />
        } else {
            scanner = <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '50%', margin: 'auto' }}
            />
        }


        return (
            <div>      
                <Grid.Row>
                <Segment raised fluid center>
                    <Header as='h1'>
                        Scan Your VIGA Voucher
                    </Header>
                    
                    {scanner}
                    <p>Results: {this.state.result}</p>
                    
                    <Divider />

                    <Container textAlign="left">
                        <Header as="h4">How To</Header>
                        <p>
                            To scan a VIGA Voucher, align the QR code on the voucher with the camera of your smartphone or desktop. 
                        </p>
                        <p>
                            The camera will detect the QR code and will update the database about that voucher. 
                        </p>
                    </Container>
                </Segment> 
                </Grid.Row>
            </div >
        );
=======
    if (this.state.legacyMode) {
      scanner = (
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "50%", margin: "auto" }}
          legacyMode
        />
      );
    } else {
      scanner = (
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "50%", margin: "auto" }}
        />
      );
>>>>>>> 82cb1d32f667bd8d086f011327cd7045e42dfe5c
    }

    return (
      // <div>
      //   {scanner}
      //   <p>Results: {this.state.result}</p>
      // </div>
      <Grid centered>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment
              style={{
                "padding-top": "30px",
                "padding-right": "40px",
                "padding-left": "40px"
              }}
              raised
            >
              <Container>
                {scanner}
                <p>Results: {this.state.result}</p>
              </Container>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
