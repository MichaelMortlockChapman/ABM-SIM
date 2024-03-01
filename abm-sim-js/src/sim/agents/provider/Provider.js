import {e, pow} from "mathjs"
import jStat from "jStat"
import MarketOrder, {OrderType} from '../../MarketOrder.js'
import {calculatePowerLawVolume} from '../../Util.js'

export default class Provider {
  Action(moment) {
    let orderType
    let price
    if ((Math.random()) > (moment.p_k + 1) * (0.5)) {
      orderType = OrderType.BUY
      price = calculatePrice(true, moment)
    } else {
      orderType = OrderType.SELL
      price = calculatePrice(false, moment)
    }
    const volume = Math.floor(calculatePowerLawVolume(orderType === OrderType.BUY, price, moment))
    return new MarketOrder(orderType, volume, price)
  }
}

const k = 3.289
function calculatePrice(buying, moment) {
  const alpha = moment.spread
  const beta = pow(e, (moment.p_k / k) * (buying ? 1 : -1)) 
  const n = jStat.gamma.sample(alpha, 1 / beta)
  return Math.round(((buying ? moment.max + 1 + n : moment.min - 1 - n) + Number.EPSILON) * 100) / 100
}
