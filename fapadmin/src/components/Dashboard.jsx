import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Segment,
  Statistic,
  Header,
  Dropdown
} from "semantic-ui-react";
import firebase from "firebase/app";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";

const orgOptions = [
  { key: "all", text: "All Organizations", value: "all" },
  { key: "f", text: "Vashon Community Food Bank", value: "foodbank" },
  { key: "d", text: "The Dove Project", value: "dove" },
  { key: "c", text: "Vashon Community Care", value: "vcc" },
  { key: "s", text: "Vashon Senior Center", value: "seniorcenter" },
  {
    key: "i",
    text: "Interfaith Council to Prevent Homelessness",
    value: "interfaith"
  },
  { key: "m", text: "Community Meals", value: "communitymeals" },
  { key: "h", text: "Vashon Household", value: "vashonhousehold" },
  { key: "l", text: "La Comunidad & ECEAP", value: "lacomunidad" },
  { key: "y", text: "VYFS", value: "vyfs" },
  { key: "x", text: "VYFS: Latinx", value: "vyfslatinx" },
  { key: "p", text: "VYFS: Family Place", value: "vyfsfamily" }
];

const keySelection = [
  {
    key: "allbucks",
    text: "All Bucks",
    value: ["created", "handedOut", "redeemed"]
  },
  { key: "created", text: "Bucks Created", value: "created" },
  { key: "redeemed", text: "Bucks Redeemed", value: "redeemed" },
  { key: "handedOut", text: "Bucks Handed Out", value: "handedOut" }
];

const options = [
  {
    text: "All Time",
    value: "all"
  },
  {
    text: "This Year",
    value: "year"
  },
  {
    text: "This Month",
    value: "month"
  }
];
const title = {
  all: "All Time",
  year: "This Year",
  month: "This Month"
};
export default function Dashboard(props) {
  // state variable, setter, useState(<default value>)
  const [charData, setCharData] = useState([]);

  // options to filter by organization
  const [curFilter, setFilter] = useState(orgOptions[0].value);

  // options to filter by buck state
  const [curChartKey, setCurChartKey] = useState(keySelection[0].value);

  // options to filter by organization
  const [timeFilter, setTimeFilter] = useState(options[0].value);

  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [curTimeline, setCurTimeline] = useState("");
  const [totalHandedOut, setTotalHandedOut] = useState(0);
  const [totalCreated, setTotalCreated] = useState(0);

  const [year, setYear] = useState();

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

  useEffect(() => {
    if (role === "admin") {
      handleAdmin();
    }
  }, [timeFilter]);

  function handleFarmer() {
    let ref = firebase
      .database()
      .ref("vis1/" + props.uid)
      .orderByValue();
    let firebaseDataArray = [];
    ref.on("child_added", snapshot => {
      let value = snapshot.val();
      let scanDay = new Date(value).toISOString().split("T")[0];
      var index = firebaseDataArray.findIndex(function(item, i) {
        return item.x === scanDay;
      });
      if (firebaseDataArray.length === 0) {
        firebaseDataArray.push({
          x: new Date(new Date(scanDay) - 1).toISOString().split("T")[0],
          y: 0
        });
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
      if (firebaseDataArray.length > 3) {
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
      let handCount = 0;
      let createCount = 0;
      for (var org in snapshot.val()) {
        let orgJSON = { created: 0, handedOut: 0, redeemed: 0 };
        orgJSON["organization"] = org;
        let value = snapshot.val();
        for (var scanType in value[org]) {
          let count = 0;
          for (var id in value[org][scanType]) {
            // if (
            //   yearOpt.some(
            //     // eslint-disable-next-line no-loop-func
            //     e =>
            //       e.value !== new Date(value[org][scanType][id]).getFullYear()
            //   )
            // ) {
            //   setYearOpt(...yearOpt, {
            //     value: new Date(value[org][scanType][id]).getFullYear(),
            //     text: new Date(value[org][scanType][id]).getFullYear()
            //   });
            // }
            if (timeFilter === options[0].value) {
              if (scanType === "redeemed") {
                redCount += 2;
              } else if (scanType === "created") {
                createCount += 2;
              } else {
                handCount += 2;
              }
              count += 2;
            } else if (timeFilter === options[1].value) {
              if (
                new Date(value[org][scanType][id]).getFullYear() ===
                new Date().getFullYear()
              ) {
                if (scanType === "redeemed") {
                  redCount += 2;
                } else if (scanType === "created") {
                  createCount += 2;
                } else {
                  handCount += 2;
                }
                count += 2;
              }
            } else {
              if (
                new Date(value[org][scanType][id]).getMonth() ===
                new Date().getMonth()
              ) {
                if (scanType === "redeemed") {
                  redCount += 2;
                } else if (scanType === "created") {
                  createCount += 2;
                } else {
                  handCount += 2;
                }
                count += 2;
              }
            }
          }
          orgJSON[scanType] = count;
        }
        firebaseDataArray.push(orgJSON);
      }

      setCharData(firebaseDataArray);
      setTotalCreated(createCount);
      setTotalHandedOut(handCount);
      setTotalRedeemed(redCount);
    });
  }
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  function handleCaseworker() {
    let ref = firebase
      .database()
      .ref()
      .child("vis2/" + props.org)
      .orderByValue();
    ref.on("value", snapshot => {
      let array = [];
      for (var key in snapshot.val()) {
        if (key !== "created") {
          let firebaseDataArray = [];
          let value = snapshot.val();
          let dates = [];
          // let datesInMonth = getDaysInMonth(
          //   new Date().getMonth() - 1,
          //   new Date().getFullYear()
          // );

          let datesInMonth = [
            "2019-05-04T07:00:00.000Z",
            "2019-05-05T07:00:00.000Z",
            "2019-05-06T07:00:00.000Z",
            "2019-05-07T07:00:00.000Z",
            "2019-05-08T07:00:00.000Z",
            "2019-05-09T07:00:00.000Z",
            "2019-05-10T07:00:00.000Z",
            "2019-05-11T07:00:00.000Z",
            "2019-05-12T07:00:00.000Z",
            "2019-05-13T07:00:00.000Z",
            "2019-05-14T07:00:00.000Z",
            "2019-05-15T07:00:00.000Z",
            "2019-05-16T07:00:00.000Z",
            "2019-05-17T07:00:00.000Z",
            "2019-05-18T07:00:00.000Z",
            "2019-05-19T07:00:00.000Z",
            "2019-05-20T07:00:00.000Z",
            "2019-05-21T07:00:00.000Z",
            "2019-05-22T07:00:00.000Z",
            "2019-05-23T07:00:00.000Z",
            "2019-05-24T07:00:00.000Z",
            "2019-05-25T07:00:00.000Z",
            "2019-05-26T07:00:00.000Z",
            "2019-05-27T07:00:00.000Z",
            "2019-05-28T07:00:00.000Z",
            "2019-05-29T07:00:00.000Z",
            "2019-05-30T07:00:00.000Z",
            "2019-06-01T07:00:00.000Z",
            "2019-06-02T07:00:00.000Z",
            "2019-06-03T07:00:00.000Z",
            "2019-06-04T07:00:00.000Z"
          ];

          for (var childKey in value[key]) {
            console.log(value[key][childKey]);
            try {
              dates.push(
                new Date(value[key][childKey]).toISOString().split("T")[0]
              );
            } catch (error) {
              console.log(error);
            }
          }

          var counts = {};

          for (var i = 0; i < dates.length; i++) {
            var day = dates[i];
            counts[day] = counts[day] ? counts[day] + 1 : 1;
          }

          let tot = 0;

          for (let i in datesInMonth) {
            let date = new Date(datesInMonth[i]).toISOString().split("T")[0];

            if (counts[date]) {
              tot += 2 * counts[date];
            }

            firebaseDataArray.push({
              x: date,
              y: tot
            });
          }

          let newData = {
            id: key,
            data: firebaseDataArray
          };
          if (key === "redeemed") {
            setTotalRedeemed(
              firebaseDataArray[firebaseDataArray.length - 1]["y"]
            );
          } else if (key === "handedOut") {
            setTotalHandedOut(
              firebaseDataArray[firebaseDataArray.length - 1]["y"]
            );
          }
          array = [...array, newData];
        }
      }
      if (enoughData(array)) {
        setIsLoaded(true);
      }
      setCharData(array);
    });
  }

  function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  function enoughData(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i]["data"].length < 5) {
        return false;
      }
    }
    return true;
  }

  function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function onOrgChange(_event, data) {
    setFilter(data.value);
  }

  function onKeyChange(_event, data) {
    setCurChartKey(data.value);
  }

  function onDateChange(_event, data) {
    setTimeFilter(data.value);
  }

  // filter for organizations +
  let filteredData;
  console.log("curChartKey", curChartKey);
  console.log("keySelection[0].value", keySelection[0].value);

  if (role === "admin") {
    if (curChartKey === keySelection[0].value) {
      console.log("all" + curChartKey);
      filteredData = charData
        .filter(
          dataPoint =>
            dataPoint.organization === curFilter ||
            curFilter === orgOptions[0].value
        )
        .map(dataPoint => ({
          organization: dataPoint.organization,
          [curChartKey[0]]: dataPoint[curChartKey[0]],
          [curChartKey[1]]: dataPoint[curChartKey[1]],
          [curChartKey[2]]: dataPoint[curChartKey[2]]
        }));
    } else {
      filteredData = charData
        .filter(
          dataPoint =>
            dataPoint.organization === curFilter ||
            curFilter === orgOptions[0].value
        )
        .map(dataPoint => ({
          organization: dataPoint.organization,
          [curChartKey]: dataPoint[curChartKey]
        }));
    }
  } else {
    filteredData = charData;
  }

  return (
    <Container fluid>
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column width={11}>
            <Segment
              className="graph_container"
              raised
              style={{ height: "700px" }}
            >
              <Header className="graph_title" size="huge">
                VIGA Farm Buck Data - {title[timeFilter]}{" "}
              </Header>
              {role === "admin" ? (
                <BarGraph curChartKey={curChartKey} charData={filteredData} />
              ) : (
                <LineGraph
                  charData={filteredData}
                  role={role}
                  isLoaded={isLoaded}
                />
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column className="graph_summary_stats_container" width={3}>
            {role === "admin" ? (
              <Segment raised padded>
                <Header as="h2">Totals</Header>
                <Statistic.Group size="small" horizontal>
                  <Statistic>
                    <Statistic.Value>
                      {"$" + numberWithCommas(totalCreated) + ".00"}
                    </Statistic.Value>
                    <Statistic.Label>Dollars Created</Statistic.Label>
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>
                      {"$" + numberWithCommas(totalHandedOut) + ".00"}
                    </Statistic.Value>
                    <Statistic.Label>Dollars Handed Out</Statistic.Label>
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>
                      {"$" + numberWithCommas(totalRedeemed) + ".00"}
                    </Statistic.Value>
                    <Statistic.Label>Dollars Redeemed</Statistic.Label>
                  </Statistic>
                </Statistic.Group>
              </Segment>
            ) : null}
            <Segment raised centered>
              <Header as="h4" content="Filter by Time Interval" />

              <Dropdown
                defaultValue={options[0].value}
                fluid
                selection
                options={options}
                onChange={onDateChange}
              />

              <Header as="h4" content="Filter by Organization" />

              <Dropdown
                defaultValue={orgOptions[0].value}
                fluid
                selection
                options={orgOptions}
                onChange={onOrgChange}
              />

              <Header as="h4" content="Filter by Buck State" />

              <Dropdown
                defaultValue={keySelection[0].value}
                fluid
                selection
                options={keySelection}
                onChange={onKeyChange}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
