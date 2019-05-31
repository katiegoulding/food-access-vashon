import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Segment,
  Statistic,
  Header,
  Icon,
  Dropdown
} from "semantic-ui-react";
import firebase from "firebase/app";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";

export default function Dashboard(props) {
  const [charData, setCharData] = useState([]);
  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [totalHandedOut, setTotalHandedOut] = useState(0);
  const [totalCreated, setTotalCreated] = useState(0);
  const [dateView, setDateView] = useState("month");

  const options = [
    {
      key: "this month",
      text: "this month",
      value: "month",
      content: "this month"
    },
    {
      key: "this year",
      text: "this year",
      value: "year",
      content: "this year"
    },
    {
      key: "all time",
      text: "all time",
      value: "all",
      content: "all time"
    }
  ];

  useEffect(() => {
    setRole(props.role);
    if (props.role === "farmer") {
      handleFarmer();
    } else if (props.role === "admin") {
      handleAdmin();
    } else if (props.role === "caseworker") {
      handleCaseworker();
    }
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
      if (firebaseDataArray.length > 2) {
        setIsLoaded(true);
      }
      setCharData([
        {
          id: "Redeemed",
          data: firebaseDataArray
        }
      ]);
      setTotalRedeemed(firebaseDataArray[firebaseDataArray.length - 1].y);
    });
  }

  function handleAdmin() {
    let ref = firebase
      .database()
      .ref()
      .child("vis2/");

    ref.on("value", snapshot => {
      // loop through each org
      let firebaseDataArray = [];
      let redCount = 0;
      for (var org in snapshot.val()) {
        let orgJSON = {};
        orgJSON["organization"] = org;
        console.log(org);
        let value = snapshot.val();
        console.log(value[org]);
        for (var scanType in value[org]) {
          console.log(scanType);
          let count = 0;
          for (var id in value[org][scanType]) {
            if (scanType == "redeemed") {
              redCount += 2;
            }
            count++;
          }
          orgJSON[scanType] = count;
        }
        firebaseDataArray.push(orgJSON);
      }
      setCharData(firebaseDataArray);
      setTotalRedeemed(redCount);
      console.log(charData);
    });
  }

  function handleCaseworker() {
    let ref = firebase
      .database()
      .ref()
      .child("vis2/" + props.org)
      .orderByValue();
    ref.on("value", snapshot => {
      let array = [];
      var startDay;
      for (var key in snapshot.val()) {
        let firebaseDataArray = [];
        console.log(key);
        let value = snapshot.val();
        console.log(value[key]);
        let dates = [];
        for (var childKey in value[key]) {
          dates.push(
            new Date(value[key][childKey]).toISOString().split("T")[0]
          );
        }
        dates.sort(function(a, b) {
          return new Date(a) - new Date(b);
        });

        if (key !== "created" && new Date(dates[0]) - new Date(startDay) > 0) {
          firebaseDataArray.push({
            x: startDay,
            y: 0
          });
        }

        for (var time in dates) {
          let scanDay = dates[time];
          if (key === "created" && time == 0) {
            startDay = scanDay;
            console.log("startDay:" + startDay);
          }

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
        }

        let newData = {
          id: key,
          data: firebaseDataArray
        };
        if (key === "redeemed") {
          setTotalRedeemed(
            firebaseDataArray[firebaseDataArray.length - 1]["y"]
          );
        }
        array = [...array, newData];
      }
      console.log(array);
      if (enoughData(array)) {
        setIsLoaded(true);
      }
      setCharData(array);
    });
    console.log(charData);
  }

  function enoughData(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i]["data"].length < 5) {
        return false;
      }
    }
    return true;
  }

  return (
    <Container>
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column width={12}>
            <Segment raised style={{ height: "700px" }}>
              {role === "admin" ? (
                <BarGraph charData={charData} />
              ) : (
                <LineGraph
                  charData={charData}
                  role={role}
                  isLoaded={isLoaded}
                />
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column width={4}>
            <Segment raised padded centered>
              <Statistic
                style={{ margin: "auto" }}
                label="Dollars Created"
                value={"$90.00"}
              />
            </Segment>
            <Segment raised padded centered>
              <Statistic
                style={{ margin: "auto" }}
                label="Dollars Redeemed"
                value={"$" + totalRedeemed + ".00"}
              />
            </Segment>
            <Segment raised padded centered>
              <Header as="h4">
                <Icon name="calendar alternate outline" />
                <Header.Content>
                  Displaying Data from{" "}
                  <Dropdown
                    inline
                    header="Adjust time span"
                    options={options}
                    defaultValue={options[0].value}
                  />
                </Header.Content>
              </Header>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
