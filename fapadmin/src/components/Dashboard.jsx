import React, { useState, useEffect } from "react";
import { Container, Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import firebase from "firebase/app";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

export default function Dashboard(props) {
  const [charData, setCharData] = useState([]);
  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRole(props.role);
    if (props.role === "farmer") {
      handleFarmer();
    } else if (props.role === "admin") {
      let ref = firebase.database().ref("vis2");
    } else if (props.role === "caseworker") {
      handleCaseworker();
    }
    console.log(enoughData());
  }, [props]);

  function handleFarmer() {
    let ref = firebase
      .database()
      .ref("vis1/" + props.uid)
      .orderByValue();
    let firebaseDataArray = [];
    ref.on("child_added", snapshot => {
      let value = snapshot.val();
      let scanDay = new Date(value).toISOString().split("T")[0];
      console.log(scanDay);
      var index = firebaseDataArray.findIndex(function(item, i) {
        return item.x === scanDay;
      });
      if (firebaseDataArray.length === 0) {
        firebaseDataArray.push({
          x: scanDay,
          y: 2
        });
      } else if (firebaseDataArray.length !== 0 && index === -1) {
        firebaseDataArray.push({
          x: scanDay,
          y: firebaseDataArray[firebaseDataArray.length - 1]["y"] + 2
        });
      } else {
        firebaseDataArray[index].y += 2;
      }
      setCharData([
        {
          id: "Redeemed",
          data: firebaseDataArray
        }
      ]);
      if (firebaseDataArray.length > 2) {
        setIsLoaded(true);
      }
    });
  }

  // function handleCaseworker() {
  //   let ref = firebase
  //     .database()
  //     .ref()
  //     .child("vis2/" + props.org)
  //     .orderByChild("created");
  //   ref.on("child_added", snapshot => {
  //     let firebaseDataArray = [];
  //     console.log(snapshot.key);
  //     console.log(snapshot.val());
  //     for (var key in snapshot.val()) {
  //       let value = snapshot.val()[key];
  //       let scanDay = new Date(value).toISOString().split("T")[0];
  //       console.log(scanDay);
  //       var index = firebaseDataArray.findIndex(function(item, i) {
  //         return item.x === scanDay;
  //       });
  //       if (firebaseDataArray.length === 0) {
  //         firebaseDataArray.push({
  //           x: scanDay,
  //           y: 2
  //         });
  //       } else if (firebaseDataArray.length !== 0 && index === -1) {
  //         firebaseDataArray.push({
  //           x: scanDay,
  //           y: firebaseDataArray[firebaseDataArray.length - 1]["y"] + 2
  //         });
  //       } else {
  //         firebaseDataArray[index].y += 2;
  //       }
  //     }
  //     console.log(firebaseDataArray);
  //     let newData = {
  //       id: snapshot.key,
  //       data: firebaseDataArray
  //     };

  //     console.log([...hello, newData]);
  //     console.log(newData);
  //     console.log(charData);
  //     console.log([...charData, newData]);
  //     setCharData([...charData, newData]);
  //   });
  // }

  function handleCaseworker() {
    let ref = firebase
      .database()
      .ref()
      .child("vis2/" + props.org)
      .orderByChild("created");
    ref.on("value", snapshot => {
      let array = [];
      for (var key in snapshot.val()) {
        let firebaseDataArray = [];
        console.log(key);
        let value = snapshot.val();
        console.log(value[key]);
        // for (var childKey in value[key]) {
        //   console.log(value[key]);
        //   let scanDay = new Date(value).toISOString().split("T")[0];
        //   console.log(scanDay);
        //   var index = firebaseDataArray.findIndex(function(item, i) {
        //     return item.x === scanDay;
        //   });
        //   if (firebaseDataArray.length === 0) {
        //     firebaseDataArray.push({
        //       x: scanDay,
        //       y: 2
        //     });
        //   } else if (firebaseDataArray.length !== 0 && index === -1) {
        //     firebaseDataArray.push({
        //       x: scanDay,
        //       y: firebaseDataArray[firebaseDataArray.length - 1]["y"] + 2
        //     });
        //   } else {
        //     firebaseDataArray[index].y += 2;
        //   }
        // }
        // let newData = {
        //   id: childKey,
        //   data: firebaseDataArray
        // };
        // array = [...array, newData];
      }
      // setCharData(array);
    });
  }

  function enoughData() {
    for (var i = 0, len = charData.length; i < len; i++) {
      console.log(charData[i]["data"].length);
      if (charData[i]["data"].length < 4) {
        return false;
      }
    }
    return true;
  }

  return (
    <Container>
      <Container>
        <Segment raised style={{ height: "700px" }}>
          {JSON.stringify(charData, null, 2)}
          {charData === [] ? null : (
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
              margin={
                role === "farmer"
                  ? { top: 10, right: 20, bottom: 40, left: 60 }
                  : { top: 10, right: 90, bottom: 40, left: 60 }
              }
              // enableSlices={false}
              lineWidth={3}
              pointSize={12}
              pointColor={"#ffffff"}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh={isLoaded}
              legends={
                role === "caseworker"
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
    </Container>
  );

  // render() {
  //   let charData = [];
  //   let data = this.state.firebaseDataArray.sort(
  //     (a, b) => new Date(a.x) - new Date(b.x)
  //   );

  //   if (this.props.role == "farmer") {
  //     charData.push({
  //       id: "Redeemed",
  //       data: data
  //     });
  //   } else if (this.props.role == "caseworker") {
  //     let redeemTemp = [];
  //     redeemTemp = this.state.redeemed;
  //     try {
  //       console.log("first created:" + this.state.created[0]["x"]);
  //       if (this.state.redeemed[0]["x"] !== this.state.created[0]["x"]) {
  //         redeemTemp.push({
  //           x: this.state.created[0]["x"],
  //           y: 0
  //         });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     redeemTemp = redeemTemp.sort((a, b) => new Date(a.x) - new Date(b.x));
  //     charData.push({
  //       id: "Redeemed",
  //       data: redeemTemp
  //     });
  //     charData.push({
  //       id: "Created",
  //       data: this.state.created
  //     });
  //     try {
  //       console.log("first created:" + this.state.created[0].getString("x"));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   console.log(JSON.stringify(charData));
  //   return (
  //     <Container>
  //       <Segment raised style={{ height: "700px" }}>
  //         {JSON.stringify(charData, null, 2)}
  //         {this.state.firebaseDataArray === [] ||
  //         this.state.created === [] ? null : (
  //           <ResponsiveLine
  //             data={charData}
  //             colors={{ scheme: "nivo" }}
  //             xScale={{
  //               type: "time",
  //               format: "%Y-%m-%d",
  //               precision: "day"
  //             }}
  //             xFormat="time: %Y-%m-%d"
  //             curve="monotoneX"
  //             yScale={{
  //               type: "linear",
  //               stacked: false
  //             }}
  //             axisLeft={{
  //               orient: "left",
  //               tickSize: 5,
  //               tickPadding: 5,
  //               tickRotation: 0,
  //               legend: "count",
  //               legendOffset: -40,
  //               legendPosition: "middle"
  //             }}
  //             axisBottom={{
  //               format: "%b %d",
  //               tickValues: "every 2 days",
  //               legend: "time scale",
  //               legendOffset: -12
  //             }}
  //             animate={true}
  //             margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
  //             // enableSlices={false}
  //             // useMesh={data.length > 2}
  //             legends={
  //               this.props.role === "caseworker"
  //                 ? [
  //                     {
  //                       anchor: "bottom-right",
  //                       direction: "column",
  //                       justify: false,
  //                       translateX: 100,
  //                       translateY: 0,
  //                       itemsSpacing: 0,
  //                       itemDirection: "left-to-right",
  //                       itemWidth: 80,
  //                       itemHeight: 20,
  //                       itemOpacity: 0.75,
  //                       symbolSize: 12,
  //                       symbolShape: "circle",
  //                       symbolBorderColor: "rgba(0, 0, 0, .5)",
  //                       effects: [
  //                         {
  //                           on: "hover",
  //                           style: {
  //                             itemBackground: "rgba(0, 0, 0, .03)",
  //                             itemOpacity: 1
  //                           }
  //                         }
  //                       ]
  //                     }
  //                   ]
  //                 : undefined
  //             }
  //           />
  //         )}
  //       </Segment>
  //     </Container>
  //   );
  // }
}
