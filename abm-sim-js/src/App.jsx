import { forwardRef, useEffect, useRef, useState } from "react";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, Stack, TextField, Typography } from "@mui/material";
import { min, max, mean } from "mathjs"

import StartSim from "./sim/Main.js";
import OrderBook from "./sim/OrderBook.js";
import BoxPlotChart from "./components/charts/BoxPlot.jsx"; 
import LineChart from "./components/charts/Line.jsx";
import jstat from "jStat";
import PaperContainer from "./components/charts/PaperContainer.jsx";
import BarChart from "./components/charts/Bar.jsx";

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

function makeDataBlock() {
  return {
    orderbook: undefined,
    sim: undefined,
    series: undefined,
    bidSeries: undefined,
    askSeries: undefined,
    volumeSeries: undefined,

  }
}

function AgentFeild(props) {
  const {checked, handleCheckedChange, agentIndex, label, amounts, handleAmountChange} = props

  return (
    <>
      <Stack direction={'row'} sx={{margin: '6px 0px 6px 0px'}} alignItems={'center'} justifyContent={'space-between'}>
        <FormControlLabel
          label={label}
          control={<Checkbox checked={checked[agentIndex]} onChange={handleCheckedChange(agentIndex)}/>}
        />
        <TextField 
          type="number" 
          label="Amount" 
          disabled={!checked[agentIndex]} 
          variant="outlined" 
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          value={amounts[agentIndex]}
          onChange={handleAmountChange(agentIndex)}
        />
        {/* {props.children} */}
      </Stack>
      <Stack direction={'row'} sx={{margin: '6px 0px 6px 0px'}} alignItems={'center'} justifyContent='end'>
        {props.children}
      </Stack>
    </>
  )
}

function App() {
    // ############### Sim Settings
    const [checked, setChecked] = useState([true, true])
    const handleCheckedChange = (checkedIndex) => {
      return (event) => {
        setChecked(checked.map((val, i) => i === checkedIndex ? event.target.checked : val))
      }
    }
    const [amounts, setAmounts] = useState([50, 5])
    const handleAmountChange = (checkedIndex) => {
      return (event) => {
        setAmounts(amounts.map((val, i) => i === checkedIndex ? event.target.value : val))
      }
    }
  
    const [FPFPrice, setFPFPrice] = useState(5)
    const handleFPFPriceChange = (e) => {
      setFPFPrice(e.target.value)
    }
  
    const [startingPrice, setStartingPrice] = useState(5)
    const handleStartingPriceChange = (e) => {
      setStartingPrice(parseInt(e.target.value)) 
    }
  
    const error = checked.filter((v) => v).length < 1;
    // ############### Sim Settings END


  const lineRef = useRef(null)
  const boxPlotRef = useRef(null)
  const barRef = useRef(null)

  const data = useRef(makeDataBlock())

  const [stopped, setStopped] = useState(true)
  const simStepIntervalID = useRef(-1)
  const handleUpdate = async () => {
    const lastVolumeNum = data.current.orderbook.prices.length
    await data.current.sim.step()
    data.current.series.push(Math.round((mean(takeLast(data.current.orderbook.prices, 50)) + Number.EPSILON) * 100) / 100)
    data.current.orderbook.bidsCopy.map((v) => dropDec(v.price)).forEach((v) => data.current.bidSeries.push(v))
    data.current.orderbook.asksCopy.map((v) => dropDec(v.price)).forEach((v) => data.current.askSeries.push(v))
    data.current.volumeSeries.push(Math.abs(data.current.orderbook.prices.length - lastVolumeNum))
  }
  const handleStart = () => {
    //reset values incase for restart use
    clearInterval(simStepIntervalID.current)
    data.current = makeDataBlock()
    data.current.orderbook = new OrderBook([...Array(50).keys().map(() => startingPrice)], [], [])
    data.current.series = []
    data.current.bidSeries = []
    data.current.askSeries = []
    data.current.volumeSeries = []
    data.current.sim = StartSim(data.current.orderbook, {
      checked: checked,
      amounts: amounts.map((v) => parseFloat(v)),
      startingPrice: parseFloat(startingPrice),
      FPFPrice: parseFloat(FPFPrice)
    })
    simStepIntervalID.current = setInterval(setIntervalWithPromise(handleUpdate), 1)
    setStopped(false)
  }
  const handleStop = () => {
    clearInterval(simStepIntervalID.current)
    setStopped(true)
  }
  const handleResume = () => {
    simStepIntervalID.current = setInterval(setIntervalWithPromise(handleUpdate), 1)
    setStopped(false)
  }

  useEffect(() => {
    // update boxPlot every n seconds so jumps are not as bad
    const boxPlotUpdate = setInterval(() => {
      if (data.current.bidSeries !== undefined && data.current.askSeries !== undefined) {
        boxPlotRef.current.state.Update({
          bids: data.current.bidSeries.length > 0 ? getBoxPlotValues(takeLast(data.current.bidSeries, 50)) : [],
          asks: data.current.askSeries.length > 0 ? getBoxPlotValues(takeLast(data.current.askSeries, 50)): [],
        })
      }
    }, 1000)
    const linePlotUpdate = setInterval(() => {
      if (data.current.series !== undefined) {
        lineRef.current.state.Update(takeLast(data.current.series, 100))
      }
    }, 100)
    const barPlotUpdate = setInterval(() => {
      if (data.current.volumeSeries !== undefined) {
        barRef.current.state.Update(takeLast(data.current.volumeSeries, 100))
      }
    }, 100)
    // clear intervals for unmounting
    return () => {
      clearInterval(simStepIntervalID.current)
      clearInterval(boxPlotUpdate)
      clearInterval(linePlotUpdate)
      clearInterval(barPlotUpdate)
    }
  }, [])

  return (
    <>
      <Stack sx={{width: '100%'}} alignItems={'center'}>
        <PaperContainer>
          <form>
            <Typography variant="h5">Settings</Typography>
            <Stack sx={{marginTop: '15px'}}>
              <FormControl error={error}>
                <FormLabel component="legend">Pick Agents</FormLabel>
                {error && <FormHelperText>Need to pick at least 1 agent type.</FormHelperText>}
                <FormGroup>
                  <AgentFeild checked={checked} handleCheckedChange={handleCheckedChange} agentIndex={0} label="Dense NN Agent" amounts={amounts} handleAmountChange={handleAmountChange}/>
                  <AgentFeild checked={checked} handleCheckedChange={handleCheckedChange} agentIndex={1} label="Random Fundamental Provider" amounts={amounts} handleAmountChange={handleAmountChange}>
                    <TextField 
                      label="Fundental Price"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={FPFPrice}
                      onChange={handleFPFPriceChange}
                      disabled={!checked[1]}
                    />
                  </AgentFeild>
                </FormGroup>
              </FormControl>
              <TextField 
                label="Starting Price"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                value={startingPrice}
                onChange={handleStartingPriceChange}
              />
            </Stack>
            <div style={{marginTop: '6px'}}>
              <Button onClick={handleStart} color={simStepIntervalID.current === -1 ? "primary": "error"} variant="contained" sx={{margin:'5px'}}>{simStepIntervalID.current === -1 ? "Start": "Restart"}</Button>
              {!stopped ?
                <Button onClick={handleStop} variant="contained" sx={{margin:'5px'}}>STOP</Button> :
                <Button onClick={handleResume} variant="contained" sx={{margin:'5px'}}>RESUME</Button>
              }
            </div>
          </form>
        </PaperContainer>
        <Grid container alignContent="center" justifyContent="center">
          <MyLineChart title="Price Average Line Graph" series={[]} ref={lineRef} yaxisTitle="Price Avg (units)" xaxisTitle="Last 100* Time Units"/>
          <MyBoxPlotChart title="Order Price Box & Whisker Graph" series={[]} ref={boxPlotRef} xaxisTitle="Price (units)">
            <Typography variant="body2" sx={{fontSize: '0.8rem', color: 'grey'}}>Updates every 1 second</Typography>
          </MyBoxPlotChart>
          <MyBarChart title="Volume Exchanged Bar Graph" series={[]} ref={barRef} yaxisTitle="Volume (units)" xaxisTitle="Last 100* Time Units"/>
        </Grid>
      </Stack>
    </>
  );
}

const MyLineChart = forwardRef(function MyChart(props, ref) {
  return (
    <LineChart series={props.series} ref={ref} {...props}/>
  )
})

const MyBoxPlotChart = forwardRef(function MyChart(props, ref) {
  return (
    <BoxPlotChart series={props.series} ref={ref} {...props}/>
  )
})

const MyBarChart = forwardRef(function MyChart(props, ref) {
  return (
    <BarChart series={props.series} ref={ref} {...props}/>
  )
})


export default App;
