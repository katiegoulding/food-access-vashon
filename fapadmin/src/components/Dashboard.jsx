import React from "react";
import Plot from 'react-plotly.js';
import Chart from "react-google-charts";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    };
  }

  //    makeplot() {
  //        Plotly.d3.csv("../../../fap_history_data.csv", function(data{ processData(data)}));
  //   }



    render() {
        const data = [
            ["Organization", "Redemption", { role: "style" }, {role: "tooltip", "type" : "string", p : {html:true}}],
            ["VYFS", 0.62, "#b87333", "tooltip text"],
            ["DOVE", 0.63, "silver", "redemption: 12"],
            ["La Comunidad", 0.29, "gold", "fapstone"],
            ["Senior Center", 0.79, "color: #e5e4e2", "<insert poop emoji here>"] // CSS-style declaration
        ];
        return (
     
            <div>
                <div className="App">
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="400px"
                        data={data}
                    />
                 </div>
                <Plot
                    // consider putting this on the backend, so its only retrieved by an authenticated API call
                    data={[
                    {
                        x: ['VYFS', 'IFCH', 'Community Dinner', 'VCCC', 'Senior Center', 'DOVE', 'La Communidad', 'VHH', 'Food Bank'],
                        y: [0.62, 0.63, 0.29, 0.79, 0.84, 0.65, 0.45, 0.81, 0.50],
                        type: 'bar',
                        name: '2018'                                          
                    },
                    {
                        x: ['VYFS', 'IFCH', 'Community Dinner', 'VCCC', 'Senior Center', 'DOVE', 'La Communidad', 'VHH', 'Food Bank'],
                        y: [0.7, 0.75, 0.73, 0.96, 0.99, 0.47, 0.64, 0.69, 0.72],
                        type: 'bar',
                        name: '2017'                       
                    },
                    {
                        x: ['VYFS', 'IFCH', 'Community Dinner', 'VCCC', 'Senior Center', 'DOVE', 'La Communidad', 'VHH', 'Food Bank'],
                        y: [0.694, 0.802, 0.46, 0.71, 0.98, 0.685, 0.567, 0.988, 0],
                        type: 'bar',
                        name: '2016'                       
                    },
                    ]}
                    layout={ {title: 'Redemption Rates', barmode: 'group', yaxis: {title: "Percent"}, xaxis: {title: "Partner Organizations"}} }
                
                />
          
                <Plot
                    data={[
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.62, 0.7, 0.694, 0.915],
                        type: 'bar',
                        name: 'VYFS'                                          
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.63, 0.75, 0.8029, 0.607],
                        type: 'bar',
                        name: 'IFCH'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.29, 0.73, 0.46, 0.3354],
                        type: 'bar',
                        name: 'Community Dinner'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.79, 0.96, 0.71, 0.9988],
                        type: 'bar',
                        name: 'VCCC'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.84, 0.99, 0.98, 0.924],
                        type: 'bar',
                        name: 'Senior Center'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.29, 0.73, 0.46, 0.808],
                        type: 'bar',
                        name: 'Community Dinner'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.65, 0.47, 0.685, 0.808],
                        type: 'bar',
                        name: 'DOVE'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.45, 0.64, 0.5677, 0.716],
                        type: 'bar',
                        name: 'La Communidad'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.81, 0.69, 0.988, 0.8267],
                        type: 'bar',
                        name: 'VHH'                       
                    },
                    {
                        x: [2018, 2017, 2016, 2015],
                        y: [0.5, 0.72, 0, 0],
                        type: 'bar',
                        name: 'Food Bank'                       
                    },
                    ]}
                    layout={ {title: 'Redemption Rates', barmode: 'group', yaxis: {title: "Percent"}, xaxis: {title: "Partner Organizations"}} }
                />

        </div>
    );
  }
}
