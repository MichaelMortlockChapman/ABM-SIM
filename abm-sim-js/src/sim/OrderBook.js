function add(el, arr) { 
  arr.splice(findLoc(el, arr) + 1, 0, el); 
  return arr; 
} 

function findLoc(el, arr, st, en) { 
  st = st || 0; 
  en = en || arr.length; 
  var pivot = parseInt(st + (en - st) / 2, 10); 
  if (en - st <= 1 || arr[pivot] === el.price) return pivot; 
  if (arr[pivot] < el.price) { 
      return findLoc(el, arr, pivot, en); 
  } else { 
      return findLoc(el, arr, st, pivot); 
  } 
}

export default class OrderBook {
  bids
  asks
  prices
  bidsCopy
  asksCopy
  constructor(prices, bids = [], asks = []) {
    this.bids = bids
    this.asks = asks
    this.prices = prices
    this.asksCopy = []
    this.bidsCopy = []
  }

  AddPrice(price) {
    this.prices.push(price)
  }

  AddBid(bid) {
    add(bid, this.bids)
  }
  AddAsk(ask) {
    add(ask, this.asks)
  }

  ClearOld(time) {
    this.bids = this.bids.filter((bid) => Math.abs(time - bid.time) < 2)
    this.asks = this.asks.filter((ask) => Math.abs(time - ask.time) < 2)
    this.prices = this.prices.filter((v,i) => this.prices.length - (1000 + 1) < i)
  }

  SortBids() {
    this.bids = this.bids.sort((a,b) => a.price < b.price)
  }
  SortAsks() {
    this.asks = this.asks.sort((a,b) => a.price > b.price)
  }

  ToString() {
    return `[${this.prices.reduce((total, p) => total + `${p}, `, " ")}]`
  }

  BidsToString() {
    return `[${this.bids.reduce((total, i) => total + `${i.ToString()} `, " ")}]`
  }
  AsksToString() {
    return `[${this.asks.reduce((total, i) => total + `${i.ToString()} `, " ")}]`
  }

  ClearCopyOrders() {
    this.asksCopy = []
    this.bidsCopy = []
  }

  CopyOrders() {
    this.asksCopy = [...this.asks]
    this.bidsCopy = [...this.bids]
  }
}