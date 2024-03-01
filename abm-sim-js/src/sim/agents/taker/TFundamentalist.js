import MarketOrder, { OrderType } from "../../MarketOrder.js"
import {calculatePowerLawVolume} from '../../Util.js'

export default class TFundamentalist {
  fundamentalistPrice;
  constructor(fundamentalistPrice) {
    this.fundamentalistPrice = fundamentalistPrice
  }

  getVolumeConstant(midPrice) {
    if (Math.abs(this.fundamentalistPrice - midPrice) <= (midPrice) * 2) {
      return 20;
    } else if (Math.abs(this.fundamentalistPrice - midPrice) > (midPrice) * 2) {
      return 50
    } else {
      return 0
    }
  }

  Action(moment) {
    let orderType
    if (this.fundamentalistPrice < moment.midPrice - (0.5 * moment.spread)) {
      orderType = OrderType.BUY
    } else if (this.fundamentalistPrice > moment.midPrice - (0.5 * moment.spread)) {
      orderType = OrderType.SELL
    } else {
      return null
    }
    const volume = calculatePowerLawVolume(orderType === OrderType.BUY, this.getVolumeConstant(moment.midPrice), moment)
    return new MarketOrder(orderType, Math.floor(volume), moment.midPrice - (0.5 * moment.spread))
  }
}