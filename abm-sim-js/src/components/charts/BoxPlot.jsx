import React from 'react'
import ReactApexCharts from 'react-apexcharts'
import PaperContainer from './PaperContainer';

class BoxPlotChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      series: [
        {
          type: 'boxPlot',
          data: [
            {
              x: 'Bids',
              y: []
            },
            {
              x: 'Asks',
              y: []
            }
          ]
        }
      ],
      options: {
        chart: {
          type: 'boxPlot',
          zoom: {
            enabled: false
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
          boxPlot: {
            colors: {
              upper: '#e9ecef',
              lower: '#f8f9fa'
            }
          },
          stroke: {
            colors: ['#6c757d']
          },
          yaxis: {
            min: 0,
          }
        }
      },
      Update: (series) => {
        this.setState({
          series: [
            {
              type: 'boxPlot',
              data: [
                {
                  x: 'Bids',
                  y: series.bids
                },
                {
                  x: 'Asks',
                  y: series.asks
                }
              ]
            }
          ],
        })
      }
    }
  }

  render() {
    return (
      <PaperContainer>
        <ReactApexCharts options={this.state.options} series={this.state.series} type="boxPlot"/>
      </PaperContainer>
    );
  }
}

export default BoxPlotChart