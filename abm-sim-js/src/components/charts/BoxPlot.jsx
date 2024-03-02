import React from 'react'
import ReactApexCharts from 'react-apexcharts'
import PaperContainer from '../PaperContainer';

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
        },
        xaxis: {
          title: {
            text: props.xaxisTitle
          },
        },
        yaxis: {
          title: {
            text: props.yaxisTitle
          }
        },
        title: {
          text: props.title,
          align: 'left'
        },
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
      },
      children: props.children
    }
  }

  render() {
    return (
      <PaperContainer>
        <ReactApexCharts options={this.state.options} series={this.state.series} type="boxPlot"/>
        {this.state.children}
      </PaperContainer>
    );
  }
}

export default BoxPlotChart