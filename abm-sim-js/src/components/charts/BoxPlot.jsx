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
          toolbar: {
            show: false
          },
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
        const bids = [...series.bids]
        const asks = [...series.asks]
        this.setState({
          series: [
            {
              type: 'boxPlot',
              data: [
                {
                  x: 'Bids',
                  y: bids
                },
                {
                  x: 'Asks',
                  y: asks
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
        <ReactApexCharts options={this.state.options} series={this.state.series} type="boxPlot" width={"100%"}/>
        {this.state.children}
      </PaperContainer>
    );
  }
}

export default BoxPlotChart