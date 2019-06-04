import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Segment,
  Statistic,
  Header,
  Dropdown,
} from "semantic-ui-react";
import firebase from "firebase/app";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";

const orgOptions = [
  { key: 'all', text: 'All Organizations', value: 'all'},
  { key: "f", text: "Vashon Community Food Bank", value: "foodbank" },
  { key: "d", text: "The Dove Project", value: "dove" },
  { key: "c", text: "Vashon Community Care", value: "vcc" },
  { key: "s", text: "Vashon Senior Center", value: "seniorcenter" },
  { key: "i", text: "Interfaith Council to Prevent Homelessness", value: "interfaith"},
  { key: "m", text: "Community Meals", value: "communitymeals"},
  { key: "h", text: "Vashon Household", value: "vashonhousehold" },
  { key: "l", text: "La Comunidad & ECEAP", value: "lacomunidad" },
  { key: "y", text: "VYFS", value: "vyfs" },
  { key: "x", text: "VYFS: Latinx", value: "vyfslatinx" },
  { key: "p", text: "VYFS: Family Place", value: "vyfsfamily" }
];

const keySelection = [
  { key: "created", text: "Bucks Created", value: "created" },
  { key: 'redeemed', text: 'Bucks Redeemed', value: 'redeemed'},
  { key: "handedOut", text: "Bucks Handed Out", value: "handedOut" },
  { key: "allbucks", text: "All Bucks", value: "allbucks" },
];


export default function Dashboard(props) {

  // state variable, setter, useState(<default value>)
  const [charData, setCharData] = useState([]);

  // options to filter by organization
  const [curFilter, setFilter] = useState(orgOptions[0].value);

  // optiosn to filter by buck state
  const [curChartKey, setCurChartKey] = useState(keySelection[0].value);
  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [curTimeline, setCurTimeline] = useState('');
  const [totalHandedOut, setTotalHandedOut] = useState(0);
  const [totalCreated, setTotalCreated] = useState(0);
  const [dateView, setDateView] = useState("month");

  const options = [
    {
      key: "this month",
      text: "This month",
      value: "month",
      content: "this month"
    },
    {
      key: "this year",
      text: "This year",
      value: "year",
      content: "this year"
    },
    {
      key: "all time",
      text: "All time",
      value: "all",
      content: "all time"
    }
  ];

  useEffect(() => {
    console.log(props.org);
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
      console.log("Organization:" + props.org);
      let array = [];
      var startDay;
      for (var key in snapshot.val()) {
        let firebaseDataArray = [];
        console.log(key);
        let value = snapshot.val();
        let dates = [];
        for (var childKey in value[key]) {
          console.log("DATE" + JSON.stringify(value[key][childKey]));

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

  function onOrgChange(_event, data) {
    setFilter(data.value)
  }

  function onKeyChange(_event, data) {
    setCurChartKey(data.value)
  }

  let filteredData = charData.filter(
    dataPoint => dataPoint.organization === curFilter || curFilter === orgOptions[0].value
  ).map(
    dataPoint => ({ organization: dataPoint.organization, [curChartKey]: dataPoint[curChartKey] } )
  )
  console.log('filteredData = ', filteredData)
  return (
    //fluid
    <Container> 
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column width={12}>
            <Segment raised style={{ height: "700px" }}>
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
            <Segment raised centered>
              <Header as="h4" content="Filter by Time Interval"/>

              <Dropdown
                defaultValue={options[0].value}
                fluid
                selection
                options={options}
              />

              <Header as="h4" content="Filter by Organization"/>

              <Dropdown
                defaultValue={orgOptions[0].value}
                fluid
                selection
                options={orgOptions}
                onChange={onOrgChange}
              />

              <Header as="h4" content="Filter by Buck State"/>

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
