export default class MarketOrder {
  orderType
  volume
  price
  time
  constructor(orderType, volume, price, time) {
    this.orderType = orderType
    this.volume = volume
    this.price = price
    this.time = time
  }

  ToString() {
    return `{orderType: ${this.orderType}, volume: ${this.volume}, price: ${this.price}, time: ${this.time}}`
  }
}

export const OrderType = {
  BUY: 0,
  SELL: 1
}