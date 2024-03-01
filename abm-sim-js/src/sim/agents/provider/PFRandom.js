import {e, pow, max} from "mathjs"
import jStat from "jStat"
import MarketOrder, {OrderType} from '../../MarketOrder.js'

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
    let result
    const alpha = 1 + ((moment.p_k))
    result = this.fundamentalPrice + (Math.random() > 0.5 ? 1 : -1) * Math.abs(this.fundamentalPrice - (this.fundamentalPrice / pow(1 - Math.random(), 1 / (alpha + 1))))
    return max([result, 0])
  }
}

