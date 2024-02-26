export default class OrderBook {
  bids
  asks
  prices
  constructor(prices, bids = [], asks = []) {
    this.bids = bids
    this.asks = asks
    this.prices = prices
  }

  AddPrice(price) {
    this.prices.push(price)
  }

  ToString() {
    return `[${this.prices.reduce((total, p) => total + `${p}, `, " ")}]`
  }
}