import React from "react";
import Plot from "react-plotly.js";
import { Container, Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import firebase from "firebase/app";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData,
      firebaseDataArray: [],
      created: [],
      redeemed: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != this.nextProps) {
      console.log("componentWillReceiveProps", nextProps);
      this.setState(nextProps);

      // let firebaseDataArray = [];
      // let ref;
      // console.log("this.state.role in Dashboard", nextProps.role);
      // if (nextProps.role === "farmer") {
      //   console.log("I'm a farmer");
      //   ref = firebase.database().ref("vis1/" + nextProps.uid);
      //   ref.on("child_added", snapshot => {
      //     const value = snapshot.val();
      //     console.log(value);
      //     let scanDay = new Date(value).toISOString().split("T")[0];
      //     var index = firebaseDataArray.findIndex(function(item, i) {
      //       return item.x === scanDay;
      //     });
      //     if (index === -1) {
      //       firebaseDataArray.push({
      //         x: scanDay,
      //         y: 2
      //       });
      //     } else {
      //       firebaseDataArray[index].y += 2;
      //     }
      //     this.setState({
      //       firebaseDataArray
      //     });
      //   });
      // } else if (nextProps.role === "admin") {
      //   ref = firebase.database().ref("vis2");
      // } else if (nextProps.role === "caseworker") {
      //   ref = firebase
      //     .database()
      //     .ref()
      //     .child("vis2/" + nextProps.org);
      // }
    }
  }

  componentDidMount() {
    let firebaseDataArray = [];
    let created = [];
    let redeemed = [];
    let ref;
    let count = 0;
    let rcount = 0;
    let ccount = 0;
    console.log("this.state.role in Dashboard", this.props.role);
    if (this.props.role === "farmer") {
      console.log("I'm a farmer");
      ref = firebase
        .database()
        .ref("vis1/" + this.props.uid)
        .orderByValue();
      ref.on("child_added", snapshot => {
        const value = snapshot.val();
        count += 2;
        console.log(value);
        let scanDay = new Date(value).toISOString().split("T")[0];
        var index = firebaseDataArray.findIndex(function(item, i) {
          return item.x === scanDay;
        });
        if (index === -1) {
          firebaseDataArray.push({
            x: scanDay,
            y: count
          });
        } else {
          firebaseDataArray[index].y += 2;
        }
        this.setState({
          firebaseDataArray
        });
      });
    } else if (this.props.role === "admin") {
      ref = firebase.database().ref("vis2");
    } else if (this.props.role === "caseworker") {
      ref = firebase
        .database()
        .ref()
        .child("vis2/" + this.props.org + "/created/")
        .orderByValue();
      ref.on("child_added", snapshot => {
        const value = snapshot.val();
        ccount += 2;
        console.log(value);
        let scanDay = new Date(value).toISOString().split("T")[0];
        var index = created.findIndex(function(item, i) {
          return item.x === scanDay;
        });
        if (index === -1) {
          created.push({
            x: scanDay,
            y: ccount
          });
        } else {
          created[index].y += 2;
        }
        this.setState({
          created
        });
      });
      ref = firebase
        .database()
        .ref()
        .child("vis2/" + this.props.org + "/redeemed/")
        .orderByValue();
      ref.on("child_added", snapshot => {
        const value = snapshot.val();
        rcount += 2;
        console.log(value);
        let scanDay = new Date(value).toISOString().split("T")[0];
        var index = redeemed.findIndex(function(item, i) {
          return item.x === scanDay;
        });
        if (index === -1) {
          redeemed.push({
            x: scanDay,
            y: rcount
          });
        } else {
          redeemed[index].y += 2;
        }
        this.setState({
          redeemed
        });
      });
    }
  }

  render() {
    let charData = [];
    let data = this.state.firebaseDataArray.sort(
      (a, b) => new Date(a.x) - new Date(b.x)
    );

    if (this.props.role == "farmer") {
      charData.push({
        id: "Redeemed",
        data: data
      });
    } else if (this.props.role == "caseworker") {
      let redeemTemp = [];
      redeemTemp = this.state.redeemed;
      try {
        console.log("first created:" + this.state.created[0]["x"]);
        if (this.state.redeemed[0]["x"] !== this.state.created[0]["x"]) {
          redeemTemp.push({
            x: this.state.created[0]["x"],
            y: 0
          });
        }
      } catch (err) {
        console.log(err);
      }
      redeemTemp = redeemTemp.sort((a, b) => new Date(a.x) - new Date(b.x));
      charData.push({
        id: "Redeemed",
        data: redeemTemp
      });
      charData.push({
        id: "Created",
        data: this.state.created
      });
      try {
        console.log("first created:" + this.state.created[0].getString("x"));
      } catch (err) {
        console.log(err);
      }
    }

    console.log(JSON.stringify(charData));
    return (
      <Container>
        <Segment raised style={{ height: "700px" }}>
          {JSON.stringify(charData, null, 2)}
          {this.state.firebaseDataArray === [] ||
          this.state.created === [] ? null : (
            <ResponsiveLine
              data={charData}
              colors={{ scheme: "nivo" }}
              xScale={{
                type: "time",
                format: "%Y-%m-%d",
                precision: "day"
              }}
              xFormat="time: %Y-%m-%d"
              curve="monotoneX"
              yScale={{
                type: "linear",
                stacked: false
              }}
              axisLeft={{
                orient: "left",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "count",
                legendOffset: -40,
                legendPosition: "middle"
              }}
              axisBottom={{
                format: "%b %d",
                tickValues: "every 2 days",
                legend: "time scale",
                legendOffset: -12
              }}
              animate={true}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              // enableSlices={false}
              // useMesh={data.length > 2}
              legends={
                this.props.role === "caseworker"
                  ? [
                      {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemBackground: "rgba(0, 0, 0, .03)",
                              itemOpacity: 1
                            }
                          }
                        ]
                      }
                    ]
                  : undefined
              }
            />
          )}
        </Segment>
      </Container>
    );
  }
}
