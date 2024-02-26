import TChartist from "./taker/TChartist.js";
import TFundamentalist from "./taker/TFundamentalist.js";
import Provider from "./provider/Provider.js"
import Moment from './Moment.js'
import MarketOrder, { OrderType } from "./MarketOrder.js";
import PRandom from "./provider/PRandom.js";

function add(el, arr) { 
  arr.splice(findLoc(el, arr) + 1, 0, el); 
  return arr; 
} 

function findLoc(el, arr, st, en) { 
  st = st || 0; 
  en = en || arr.length; 
  var pivot = parseInt(st + (en - st) / 2, 10); 
  if (en - st <= 1 || arr[pivot] === el.price) return pivot; 
  if (arr[pivot] < el.price) { 
      return findLoc(el, arr, pivot, en); 
  } else { 
      return findLoc(el, arr, st, pivot); 
  } 
}

export default function StartSim(orderBook) {
  // const TCs = []
  // const TFs = []
  // const Ps = []
  const things = []
  for (let i = 0; i < 50; i++) {
    // TCs.push(new TChartist(0.005, 5))
    // TFs.push(new TFundamentalist(5))
    // Ps.push(new Provider())
    things.push(new PRandom())
  }

  function SimLoop() {
    /// GEN MARKET ORDERS
    const moment = new Moment(orderBook)
    let bids = []
    let asks = []
    //simple function to pass actions (market orders) to their arrays
    const doAction = (agent) => {
      const marketOrder = agent.Action(moment)
      // in-case action makes no action (null) return
      if (marketOrder === null) {
        return
      }
      if (marketOrder.orderType === OrderType.BUY) {
        bids.push(marketOrder)
      } else {
        asks.push(marketOrder)
      }
    }

    // TCs.forEach(doAction)
    // TFs.forEach(doAction)
    // Ps.forEach(doAction)
    things.forEach(doAction)

    /// MATCH ORDERS
    bids = bids.sort((a,b) => a.price < b.price)
    asks = asks.sort((a,b) => a.price > b.price)
    // console.log(`[${bids.reduce((total, i) => total + `${i.ToString()} `, " ")}]`)
    // console.log()
    // console.log(`[${asks.reduce((total, i) => total + `${i.ToString()} `, " ")}]`)

    let staleflag = false 
    while (bids.length > 0 && asks.length > 0 && !staleflag) {
      const bid = bids[0]
      const ask = asks[0]
      //no orders can be 
      if (bid.price < ask.price) {
        staleflag = true
        continue
      }
      if (bid.volume === ask.volume) {
        bids.splice(0, 1)
        asks.splice(0, 1)
        orderBook.AddPrice(bid.price)
      } else if (bid.volume > ask.volume) {
        bids.splice(0, 1)
        add(new MarketOrder(bid.orderType, bid.volume - ask.volume, bid.price), bids)
        asks.splice(0, 1)
        orderBook.AddPrice(bid.price)
      } else {
        bids.splice(0, 1)
        asks.splice(0, 1)
        add(new MarketOrder(ask.orderType, ask.volume - bid.volume, ask.price), asks)
        orderBook.AddPrice(bid.price)
      }
    }

    /// UPDATE/CLEAN AGENTS/ORDER BOOK
    //TODO

    /// PRINT STATS
    // console.log(`ORDER BOOK: ${orderBook.ToString()}`)
    // console.log(`MOMENT: ${moment.ToString()}`)
    // console.log(`BIDS (${bids.length}):`)
    // console.log(`[${bids.reduce((total, i) => total + `${i.ToString()} `, " ")}]`)
    // console.log(`ASKS (${asks.length}):`)
    // console.log(`[${asks.reduce((total, i) => total + `${i.ToString()} `, " ")}]`)
    // console.log("")
  }
  
  return {
    "step": SimLoop
  }
}