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
  {
    key: "allbucks",
    text: "All Bucks",
    value: ["redeemed", "handedOut", "created"]
  },
  { key: "created", text: "Bucks Created", value: "created" },
  { key: 'redeemed', text: 'Bucks Redeemed', value: 'redeemed'},
  { key: "handedOut", text: "Bucks Handed Out", value: "handedOut" },
];


export default function Dashboard(props) {

  // state variable, setter, useState(<default value>)
  const [charData, setCharData] = useState([]);

  // options to filter by organization
  const [curFilter, setFilter] = useState(orgOptions[0].value);

  // options to filter by buck state
  const [curChartKey, setCurChartKey] = useState(keySelection[0].value);
  
  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [curTimeline, setCurTimeline] = useState('');
  const [totalHandedOut, setTotalHandedOut] = useState(0);
  const [totalCreated, setTotalCreated] = useState(0);
  const [yearOpt, setYearOpt] = useState([
    {
      text: "all time",
      value: "all"
    }
  ]);

  const [year, setYear] = useState();

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
            console.log(value[org][scanType][id]);
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
            if (scanType === "redeemed") {
              redCount += 2;
            } else if (scanType === "created") {
              createCount += 2;
            } else {
              handCount += 2;
            }
            count += 2;
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
          let datesInMonth = getDaysInMonth(
            new Date().getMonth() - 1,
            new Date().getFullYear()
          );

          for (var childKey in value[key]) {
            dates.push(
              new Date(value[key][childKey]).toISOString().split("T")[0]
            );
          }

          var counts = {};

          for (var i = 0; i < dates.length; i++) {
            var day = dates[i];
            counts[day] = counts[day] ? counts[day] + 1 : 1;
          }
          console.log(counts);

          let tot = 0;

          for (let i in datesInMonth) {
            let date = datesInMonth[i].toISOString().split("T")[0];

            if (counts[date]) {
              tot += 2 * counts[date];
            }

            firebaseDataArray.push({
              x: date,
              y: tot
            });
          }

          console.log(firebaseDataArray);

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
    setFilter(data.value)
  }

  function onKeyChange(_event, data) {
    setCurChartKey(data.value)
  }

  // filter for organizations +
  let filteredData 
  console.log("curChartKey", curChartKey)
  console.log("keySelection[0].value", keySelection[0].value)

  if(curChartKey === keySelection[0].value) {
    console.log("all" + curChartKey)
    filteredData = charData.filter(
      dataPoint => dataPoint.organization === curFilter || curFilter === orgOptions[0].value
    ).map(
      dataPoint => ({ organization: dataPoint.organization, "redeemed": dataPoint[curChartKey[0]], "handedOut": dataPoint[curChartKey[1]], "created": dataPoint[curChartKey[2]] })
    )
  } else {
    console.log(curChartKey)
    filteredData = charData.filter(
      dataPoint => dataPoint.organization === curFilter || curFilter === orgOptions[0].value
    ).map(
      dataPoint => ({ organization: dataPoint.organization, [curChartKey]: dataPoint[curChartKey] })
    )
  }
  
  console.log('filteredData = ', filteredData)
  
  return (
    <Container fluid>
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column width={11}>
            <Segment className="graph_container" raised style={{ height: "700px" }}>
            <Header className="graph_title" size="huge">VIGA Farm Buck Data from </Header>
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
              <Segment raised padded centered>
                <Statistic
                  style={{ margin: "auto" }}
                  label="Dollars Created"
                  value={"$" + numberWithCommas(totalCreated) + ".00"}
                />
              </Segment>
            ) : null}
            {role !== "farmer" ? (
              <Segment raised padded centered>
                <Statistic
                  style={{ margin: "auto" }}
                  label="Dollars Handed Out"
                  value={"$" + numberWithCommas(totalHandedOut) + ".00"}
                />
              </Segment>
            ) : null}
            <Segment raised padded centered>
              <Statistic
                style={{ margin: "auto" }}
                label="Dollars Redeemed"
                value={"$" + numberWithCommas(totalRedeemed) + ".00"}
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
