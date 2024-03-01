import MarketOrder, { OrderType } from "../../MarketOrder.js"
import {calculatePowerLawVolume} from '../../Util.js'

export default class TChartist {
  forgettingFactor
  EWMA
  constructor(forgettingFactor, EWMA) {
    this.forgettingFactor = forgettingFactor
    this.EWMA = EWMA
  }

  getEWMA(midPrice) {
    this.EWMA = this.EWMA + (this.forgettingFactor) * (this.EWMA - midPrice)
    return this.EWMA
  }

  getVolumeConstant(midPrice) {
    if (Math.abs(this.EWMA - midPrice) <= (midPrice) * 2) {
      return 20;
    } else if (Math.abs(this.EWMA - midPrice) > (midPrice) * 2) {
      return 50
    } else {
      return 0
    }
  }

  Action(moment) {
    let EWMA = this.getEWMA(moment.midPrice)
    let orderType
    if (EWMA < moment.midPrice - (0.5 * moment.spread)) {
      orderType = OrderType.BUY
    } else if (EWMA > moment.midPrice - (0.5 * moment.spread)) {
      orderType = OrderType.SELL
    } else {
      return null
    }
    const volume = calculatePowerLawVolume(orderType === OrderType.BUY, this.getVolumeConstant(moment.midPrice), moment)
    return new MarketOrder(orderType, Math.floor(volume), EWMA)
  }
}