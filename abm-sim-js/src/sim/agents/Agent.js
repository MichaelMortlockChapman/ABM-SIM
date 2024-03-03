import { OrderType } from "../MarketOrder.js"

export default class Agent {
  capital
  volumeHeld
  agentID
  isAIAgent
  constructor(agentID, startingCapital, startingVolumeHeld, isAIAgent = false) {
    this.agentID = agentID
    this.capital = startingCapital
    this.volumeHeld = startingVolumeHeld
    this.isAIAgent = isAIAgent
  }

  Exchange(orderType, price, volume) {
    if (orderType === OrderType.BUY) {
      this.capital -= price
      this.volumeHeld += volume
    } else {
      this.capital += price
      this.volumeHeld -= volume
    }
  }
}