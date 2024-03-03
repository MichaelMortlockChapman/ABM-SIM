import {pow, max} from "mathjs"
import MarketOrder, {OrderType} from '../../MarketOrder.js'
import Agent from "../Agent.js"

export default class PFRandom extends Agent {
  fundamentalPrice
  constructor(agnetID, startingCaptial, startingVolumeHeld, fundamentalPrice) {
    super(agnetID, startingCaptial, startingVolumeHeld, false)
    this.fundamentalPrice = fundamentalPrice
  }

  Action(moment, time) {
    let orderType
    let price
    if ((Math.random()) > 0.5 && this.volumeHeld > 0) {
      orderType = OrderType.SELL
      price = this.calculatePrice(false, moment)
    } else {
      orderType = OrderType.BUY
      // price = Math.max(Math.min(this.calculatePrice(true, moment), 2), 0)
      price = this.calculatePrice(true, moment)
    }
    return new MarketOrder(orderType, 1, price, time, this.agentID)
  }
  
  calculatePrice(buying, moment) {
    let result
    const alpha = 1 + ((moment.p_k))
    result = this.fundamentalPrice + (Math.random() > 0.5 ? 1 : -1) * Math.abs(this.fundamentalPrice - (this.fundamentalPrice / pow(1 - Math.random(), 1 / (alpha + 1))))
    return max([result, 0])
  }
}

