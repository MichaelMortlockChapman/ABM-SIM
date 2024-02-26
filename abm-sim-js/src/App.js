import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import {median} from "mathjs"

import StartSim from "./sim/Main.js";
import OrderBook from "./sim/OrderBook.js";
import { LineChart } from "@mui/x-charts";

function createChart(displayData) {
  return <LineChart
    xAxis={[{ data: displayData[0] }]}
    series={[
      {
        data: displayData[1],
        showMark: false,
      },
    ]}
    width={500}
    height={300}
  />
}

function App() {
  const [data, setData] = useState(new OrderBook([5]))
  const [display, setDisplay] = useState(<></>)
  const displayData = useRef( [[], []] )
  const Sim = StartSim(data)

  const handleUpdate = () => {
    Sim.step()
    setData(data => data)
    displayData.current[0].push(displayData.current[0].length + 1)
    displayData.current[1].push(median(data.prices))
    setDisplay(createChart(displayData.current))
  }

  const intervalID = useRef(-1)
  useEffect(() => {
    intervalID.current = setInterval(handleUpdate, 500)

    return () => {
      clearInterval(intervalID.current)
      console.log(intervalID.current);
    }
  }, [])

  const handleButton = () => {
    clearInterval(intervalID.current)
  }

  return (
    <>
      {display}
      <Button onClick={handleButton} variant="contained">STOP</Button>
    </>
  );
}

export default App;
