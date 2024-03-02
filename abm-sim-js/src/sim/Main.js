import Moment from './Moment.js'
import MarketOrder, { OrderType } from "./MarketOrder.js";

import PFRandom from "./agents/provider/PFRandom.js"
import PRandom from './agents/provider/PRandom.js';
import RLAgent from './agents/RLAgent.js';


function SimSettingsFactory(settings) {
  const result = {
    "RLAgents": [],
    "agents": [],
  }
  if (settings.checked[0]) {
    Array(settings.amounts[0]).keys().forEach(() => {
      result.RLAgents.push(new RLAgent(settings.startingPrice))
    })
  }
  if (settings.checked[1]) {
    Array(settings.amounts[1]).keys().forEach(() => {
      result.agents.push(new PFRandom(settings.FPFPrice))
    })
  }
  if (settings.checked[2]) {
    Array(settings.amounts[2]).keys().forEach(() => {
      result.agents.push(new PRandom(settings.FPFPrice))
    })
  }
  return result
}

export default function StartSim(orderBook, settings) {
  const simSettings = SimSettingsFactory(settings)
  const RLAgents = simSettings.RLAgents
  const agents = simSettings.agents

  const time = {current:0}

  async function SimLoop() {
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

    orderBook.ClearCopyOrders()
    agents.forEach(doAction)
    RLAgents.forEach(doAction)
    orderBook.CopyOrders()

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
    await Promise.all([RLAgents.map((agent) => agent.Learn(new Moment(orderBook)))])
  }
  
  return {
    "step": SimLoop
  }
}