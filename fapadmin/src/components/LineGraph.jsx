import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

export default function LineGraph(props) {
  const [charData, setCharData] = useState([]);
  const [role, setRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Only called after props update
  useEffect(() => {
    setRole(props.role);
    setIsLoaded(props.isLoaded);
    setCharData(props.charData);
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
        legend: "Dollars",
        legendOffset: -40,
        legendPosition: "middle"
      }}
      axisBottom={{
        format: "%b %d",
        tickValues: "every 5 days",
        legend: "Time Scale",
        legendOffset: -12
      }}
      animate={true}
      margin={
        role === "farmer"
          ? { top: 10, right: 20, bottom: 50, left: 60 }
          : { top: 10, right: 90, bottom: 50, left: 60 }
      }
      enableSlices={"x"}
      lineWidth={3}
      enableArea={true}
      sliceTooltip={({ slice }) => {
        return (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc"
            }}
          >
            <strong>Date:</strong> {slice.points[0].data.xFormatted}
            {slice.points.map(point => (
              <div
                key={point.id}
                style={{
                  color: point.serieColor
                }}
              >
                <strong>{point.serieId}:</strong> ${point.data.yFormatted}.00
              </div>
            ))}
          </div>
        );
      }}
      legends={
        role === "caseworker"
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 90,
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
