import {max} from "mathjs"
import jstat from "jstat"
import MarketOrder, {OrderType} from '../../MarketOrder.js'
import Agent from "../Agent.js"

export default class PRandom extends Agent {
  constructor(agnetID, startingCaptial, startingVolumeHeld) {
    super(agnetID, startingCaptial, startingVolumeHeld, false)
  }

  Action(moment, time) {
    let orderType
    let price
    if ((Math.random()) > 0.5) {
      orderType = OrderType.BUY
      price = calculatePrice(true, moment)
    } else {
      orderType = OrderType.SELL
      price = calculatePrice(false, moment)
    }
    return new MarketOrder(orderType, 1, price, time, this.agentID)
  }
}

function calculatePrice(buying, moment) {
  const n = max([jstat.normal.sample(moment.midPrice, 40), 0])
  return Math.round(((n) + Number.EPSILON) * 100) / 100
}
