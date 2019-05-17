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
      firebaseDataArray: []
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
    let ref;
    console.log("this.state.role in Dashboard", this.props.role);
    if (this.props.role === "farmer") {
      console.log("I'm a farmer");
      ref = firebase.database().ref("vis1/" + this.props.uid);
      ref.on("child_added", snapshot => {
        const value = snapshot.val();
        console.log(value);
        let scanDay = new Date(value).toISOString().split("T")[0];
        var index = firebaseDataArray.findIndex(function(item, i) {
          return item.x === scanDay;
        });
        if (index === -1) {
          firebaseDataArray.push({
            x: scanDay,
            y: 2
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
        .child("vis2/" + this.props.org);
    }
  }

  render() {
    let charData = [];
    let data = this.state.firebaseDataArray.sort(
      (a, b) => new Date(a.x) - new Date(b.x)
    );

    charData.push({
      id: "random shit",
      data: data
    });

    console.log(JSON.stringify(this.state.firebaseDataArray));
    return (
      <Container>
        <Segment raised style={{ height: "700px" }}>
          {JSON.stringify(this.state.firebaseDataArray, null, 2)}
          {this.state.firebaseDataArray == [] ? null : (
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
              mesh={data.length !== 0}
            />
          )}
        </Segment>
        {/* <Plot
          // consider putting this on the backend, so its only retrieved by an authenticated API call
          data={[
            {
              x: [
                "VYFS",
                "IFCH",
                "Community Dinner",
                "VCCC",
                "Senior Center",
                "DOVE",
                "La Communidad",
                "VHH",
                "Food Bank"
              ],
              y: [0.62, 0.63, 0.29, 0.79, 0.84, 0.65, 0.45, 0.81, 0.5],
              type: "bar",
              name: "2018"
            },
            {
              x: [
                "VYFS",
                "IFCH",
                "Community Dinner",
                "VCCC",
                "Senior Center",
                "DOVE",
                "La Communidad",
                "VHH",
                "Food Bank"
              ],
              y: [0.7, 0.75, 0.73, 0.96, 0.99, 0.47, 0.64, 0.69, 0.72],
              type: "bar",
              name: "2017"
            },
            {
              x: [
                "VYFS",
                "IFCH",
                "Community Dinner",
                "VCCC",
                "Senior Center",
                "DOVE",
                "La Communidad",
                "VHH",
                "Food Bank"
              ],
              y: [0.694, 0.802, 0.46, 0.71, 0.98, 0.685, 0.567, 0.988, 0],
              type: "bar",
              name: "2016"
            }
          ]}
          layout={{
            title: "Redemption Rates",
            barmode: "group",
            yaxis: { title: "Percent" },
            xaxis: { title: "Partner Organizations" }
          }}
        />

        <Plot
          data={[
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.62, 0.7, 0.694, 0.915],
              type: "bar",
              name: "VYFS"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.63, 0.75, 0.8029, 0.607],
              type: "bar",
              name: "IFCH"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.29, 0.73, 0.46, 0.3354],
              type: "bar",
              name: "Community Dinner"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.79, 0.96, 0.71, 0.9988],
              type: "bar",
              name: "VCCC"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.84, 0.99, 0.98, 0.924],
              type: "bar",
              name: "Senior Center"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.29, 0.73, 0.46, 0.808],
              type: "bar",
              name: "Community Dinner"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.65, 0.47, 0.685, 0.808],
              type: "bar",
              name: "DOVE"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.45, 0.64, 0.5677, 0.716],
              type: "bar",
              name: "La Communidad"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.81, 0.69, 0.988, 0.8267],
              type: "bar",
              name: "VHH"
            },
            {
              x: [2018, 2017, 2016, 2015],
              y: [0.5, 0.72, 0, 0],
              type: "bar",
              name: "Food Bank"
            }
          ]}
          layout={{
            title: "Redemption Rates",
            barmode: "group",
            yaxis: { title: "Percent" },
            xaxis: { title: "Partner Organizations" }
          }}
        />
        <Plot
          data={[
            {
              values: [20, 30, 50],
              type: "pie",
              labels: ["a", "b", "c"]
            }
          ]}
          layout={{ title: "Pie" }}
        /> */}
      </Container>
    );
  }
}
