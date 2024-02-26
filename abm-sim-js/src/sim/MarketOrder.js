export default class MarketOrder {
  orderType
  volume
  price
  constructor(orderType, volume, price) {
    this.orderType = orderType
    this.volume = volume
    this.price = price
  }

  ToString() {
    return `{orderType: ${this.orderType}, volume: ${this.volume}, price: ${this.price}}`
  }
}

export const OrderType = {
  BUY: 0,
  SELL: 1
}