import {e, pow, max} from "mathjs"
import jStat from "jStat"
import MarketOrder, {OrderType} from '../MarketOrder.js'

export default class PFRandom {
  fundamentalPrice
  constructor(fundamentalPrice) {
    this.fundamentalPrice = fundamentalPrice
  }

  Action(moment, time) {
    let orderType
    let price
    if ((Math.random()) > 0.5) {
      orderType = OrderType.BUY
      price = this.calculatePrice(true, moment)
    } else {
      orderType = OrderType.SELL
      price = this.calculatePrice(false, moment)
    }
    return new MarketOrder(orderType, 1, price, time)
  }
  
  calculatePrice(buying, moment) {
    const n = max([jStat.normal.sample(this.fundamentalPrice + buying ? 1 : -1, 40), 0])
    return Math.round(((n) + Number.EPSILON) * 100) / 100
  }
}

