import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

export default function LineGraph(props) {
  const [charData, setCharData] = useState([]);
  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const options = [
    {
      key: "All Time",
      text: "All Time",
      value: "all",
      content: "All Time"
    },
    {
      key: "This Month",
      text: "This Month",
      value: "month",
      content: "This Month"
    },
    {
      key: "This Year",
      text: "This Year",
      value: "year",
      content: "This Year"
    }
  ];

  useEffect(() => {
    setRole(props.role);
    setCharData(props.charData);
    setIsLoaded(props.isLoaded);
  }, [props]);

  return (
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
          ? { top: 10, right: 20, bottom: 50, left: 60 }
          : { top: 10, right: 90, bottom: 50, left: 60 }
      }
      enableSlices={isLoaded ? false : "x"}
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
  );
}
