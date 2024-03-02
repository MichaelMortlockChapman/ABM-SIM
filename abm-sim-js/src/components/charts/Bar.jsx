import React from 'react'
import ReactApexCharts from 'react-apexcharts'
import PaperContainer from '../PaperContainer'

class BarChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      series: [{
        data: []
      }],
      options: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
        },
        title: {
          text: props.title,
          align: 'left'
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
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false
        }
      },
      Update: (series) => {
        const _series = [...series]
        this.setState({
          series: [{
            data: _series
          }]
        })
      }
    }
  }

  render() {
    return (
      <PaperContainer>
        <ReactApexCharts options={this.state.options} series={this.state.series} type="bar" width={"100%"}/>
      </PaperContainer>
    );
  }
}

export default BarChart