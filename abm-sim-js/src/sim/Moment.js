import {std, mean, median, max, min} from "mathjs"

export default class Moment {
  mean 
  stddev 
  midPrice
  spread
  p_k 
  min
  max
  constructor(ob) {
    this.mean = mean(ob.prices)
    this.stddev = std(ob.prices)
    this.midPrice = median(ob.prices)
    
    this.max = max(ob.prices)
    this.min = min(ob.prices)
    this.spread = Math.abs(this.max - this.min)

    this.p_k = ob.asks.length + ob.bids.length > 0 ? (ob.asks.length - ob.bids.length) / ob.asks.length + ob.bids.length : 0 
  }

  ToString() {
    return `{
mean: ${this.mean}
midPrice: ${this.midPrice}
spread: ${this.spread}
p_k: ${this.p_k}
min: ${this.min}
max: ${this.max} 
}`
  }
}