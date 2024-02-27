import Moment from './Moment.js'
import MarketOrder, { OrderType } from "./MarketOrder.js";

import TChartist from "./taker/TChartist.js";
import TFundamentalist from "./taker/TFundamentalist.js";
import Provider from "./provider/Provider.js"
import PRandom from "./provider/PRandom.js";
import PFRandom from "./provider/PFRandom.js"

export default function StartSim(orderBook) {
  const agents = []
  for (let i = 0; i < 50; i++) {
    agents.push(new PFRandom(5))
  }

  const time = {current:0}

  function SimLoop() {
    //############## GEN MARKET ORDERS ##############
    const moment = new Moment(orderBook)
    //simple function to pass actions (market orders) to their arrays
    const doAction = (agent) => {
      const marketOrder = agent.Action(moment, time.current)
      // in-case agent makes no action (null) return
      if (marketOrder === null) {
        return
      }
      if (marketOrder.orderType === OrderType.BUY) {
        orderBook.AddBid(marketOrder)
      } else {
        orderBook.AddAsk(marketOrder)
      }
    }

    agents.forEach(doAction)

    //############## MATCH ORDERS ##############
    orderBook.SortBids()
    orderBook.SortAsks()
    while (orderBook.bids.length > 0 && orderBook.asks.length > 0) {
      const bid = orderBook.bids[0]
      const ask = orderBook.asks[0]
      orderBook.bids.splice(0, 1)
      orderBook.asks.splice(0, 1)
      //no orders can be fulfilled 
      if (bid.price < ask.price) {
        break
      }
      if (bid.volume === ask.volume) {
        orderBook.AddPrice(bid.price)
      } else if (bid.volume > ask.volume) {
        orderBook.AddBid(new MarketOrder(bid.orderType, bid.volume - ask.volume, bid.price))
        orderBook.AddPrice(bid.price)
      } else {
        orderBook.AddAsk(new MarketOrder(ask.orderType, ask.volume - bid.volume, ask.price))
        orderBook.AddPrice(bid.price)
      }
    }

    //############## UPDATE/CLEAN AGENTS/ORDER BOOK ##############
    orderBook.ClearOld(time.current)
    time.current = time.current + 1

    //############## PRINT INFO ##############
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