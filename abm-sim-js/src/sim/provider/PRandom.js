import {e, pow, max} from "mathjs"
import jStat from "jStat"
import MarketOrder, {OrderType} from '../MarketOrder.js'

export default class PRandom {
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
    return new MarketOrder(orderType, 1, price, time)
  }
}

function calculatePrice(buying, moment) {
  const n = max([jStat.normal.sample(moment.midPrice, 40), 0])
  return Math.round(((n) + Number.EPSILON) * 100) / 100
}
