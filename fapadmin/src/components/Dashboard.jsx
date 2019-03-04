import React from "react";
import Plot from 'react-plotly.js';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: props.chartData,           
        }
    }
    render() {
        return (
            <div>
                <Plot
                    data={[
                    {
                        x: ['giraffes', 'orangutans', 'monkeys'],
                        y: [20, 14, 23],
                        type: 'bar'
                        
                    },
                    ]}
                    layout={ {width: 320, height: 240, title: 'A Plot'} }
                />
                />
            </div>
        )
    }
}