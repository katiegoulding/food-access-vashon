import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Header } from "semantic-ui-react";

export default function BarGraph(props) {
  const [charData, setCharData] = useState([]);

  useEffect(() => {
    setCharData(props.charData);
  }, [props]);

  return (
    <ResponsiveBar
      data={charData}
      keys={
        Array.isArray(props.curChartKey)
          ? props.curChartKey
          : [props.curChartKey]
      }
      indexBy="organization"
      theme={{
        axis: {
          ticks: {
            text: { fontSize: "18px" }
          },
          legend: {
            text: { fontSize: "18px" }
          }
        },
        legends: { text: { fontSize: "18px" } }
      }}
      margin={{ top: 50, right: 150, bottom: 200, left: 80 }}
      padding={0.2}
      groupMode="grouped"
      colors={["#ABDDA4", "#66C2A5", "#3288BD"]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        legend: "Organization",
        legendPosition: "middle",
        legendOffset: 100
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Dollars",
        legendPosition: "middle",
        legendOffset: -55
      }}
      tooltip={({ data, indexValue }) => (
        <div style={{ overflow: "auto" }}>
          {indexValue.toUpperCase()}
          <div>
            Created:
            <div style={{ marginLeft: "5px", float: "right" }}>
              ${data["created"]}.00
            </div>
          </div>
          <div>
            Distributed:
            <div style={{ marginLeft: "5px", float: "right" }}>
              ${data["handedOut"]}.00
            </div>
          </div>
          <div>
            Redeemed:
            <div style={{ marginLeft: "5px", float: "right" }}>
              ${data["redeemed"]}.00
            </div>
          </div>
        </div>
      )}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 15,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    />
  );
}
