import { forwardRef, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import {median, min, max, mean} from "mathjs"

import StartSim from "./sim/Main.js";
import OrderBook from "./sim/OrderBook.js";
import BoxPlotChart from "./charts/BoxPlot.jsx"; 
import LineChart from "./charts/Line.jsx";
import jstat from "jStat";

function dropDec(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100
}

function getBoxPlotValues(arr) {
  let qartiles = jstat(arr).quartiles()
  return [min(arr), qartiles[0], qartiles[1], qartiles[2], max(arr)]
}

function setIntervalWithPromise(target) {
  return async function(...args) {
      if (target.isRunning)
        return
      // if we are here, we can invoke our callback!
      target.isRunning = true
      await target(...args)
      target.isRunning = false
  }  
}

const takeLast = (arr, n) => arr.filter((v,i) => arr.length - (n + 1) < i)

function App() {
  const [data, setData] = useState(new OrderBook([...Array(50).keys().map(() => 5)], [], []))
  const lineRef = useRef(null)
  const boxPlotRef = useRef(null)

  const Sim = StartSim(data)
  const series = []
  const bidSeries = []
  const askSeries = []

  const simStepIntervalID = useRef(-1)
  const handleUpdate = async () => {
    await Sim.step()
    setData(data => data)
    series.push(Math.round((mean(takeLast(data.prices, 50)) + Number.EPSILON) * 100) / 100)
    data.bidsCopy.map((v) => dropDec(v.price)).forEach((v) => bidSeries.push(v))
    data.asksCopy.map((v) => dropDec(v.price)).forEach((v) => askSeries.push(v))
  }
  const handleStart = () => {
    simStepIntervalID.current = setInterval(setIntervalWithPromise(handleUpdate), 1)
  }
  const handleStop = () => {
    clearInterval(simStepIntervalID.current)
  }

  useEffect(() => {
    // update boxPlot every n seconds so jumps are not as bad
    const boxPlotUpdate = setInterval(() => {
      boxPlotRef.current.state.Update({
        bids: bidSeries.length > 0 ? getBoxPlotValues(takeLast(bidSeries, 50)) : [],
        asks: askSeries.length > 0 ? getBoxPlotValues(takeLast(askSeries, 50)): [],
      })
    }, 1000)
    const linePlotUpdate = setInterval(() => {
      lineRef.current.state.Update(takeLast(series, 100))
    }, 10)
    // clear intervals for unmounting
    return () => {
      clearInterval(simStepIntervalID.current)
      clearInterval(boxPlotUpdate)
      clearInterval(linePlotUpdate)
    }
  }, [])

  return (
    <>
      <Button onClick={handleStart} variant="contained" sx={{margin:'5px'}}>START</Button>
      <Button onClick={handleStop} variant="contained" sx={{margin:'5px'}}>STOP</Button>
      <MyLineChart series={series} ref={lineRef}/>
      <MyBoxPlotChart series={[]} ref={boxPlotRef}/>
    </>
  );
}

const MyLineChart = forwardRef(function MyChart(props, ref) {
  return (
    <>
      <LineChart series={props.series} ref={ref}/>
    </>
  )
})

const MyBoxPlotChart = forwardRef(function MyChart(props, ref) {
  return (
    <>
      <BoxPlotChart series={props.series} ref={ref}/>
    </>
  )
})

export default App;
