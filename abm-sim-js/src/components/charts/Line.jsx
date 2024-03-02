import React from 'react'
import ReactApexCharts from 'react-apexcharts'
import ApexCharts from 'apexcharts'
import PaperContainer from './PaperContainer'

class LineChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      series: [{
        data: [[]]
      }],
      options: {
        chart: {
          id: 'realtime',
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          animations: {
            enabled: false,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
        },
        markers: {
          enabled: false,
          size: 0
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: props.title,
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          type: 'numeric',
          title: {
            text: props.xaxisTitle
          },
        },
        yaxis: {
          title: {
            text: props.yaxisTitle
          }
        },
        legend: {
          show: false
        },
      },
      Update: (series) => {
        ApexCharts.exec('realtime', 'updateSeries', [{
          data: series.map((v,i) => [i, v])
        }])
      }
    }
  }

  render() {
    return (
      <PaperContainer>
        <ReactApexCharts options={this.state.options} series={this.state.series} type="line"/>
      </PaperContainer>
    );
  }
}

export default LineChart