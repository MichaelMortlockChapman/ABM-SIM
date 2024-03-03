import {pow, max} from "mathjs"
import * as tf from '@tensorflow/tfjs'
import MarketOrder, {OrderType} from '../../MarketOrder.js'
import Agent from "../Agent.js"

export default class RLAgent extends Agent {
  model
  lastOrder
  constructor(agnetID, startingCaptial, startingVolumeHeld, startingPrice) {
    super(agnetID, startingCaptial, startingVolumeHeld, true)

    this.model = tf.sequential({
      layers: [
        // tf.layers.input({shape: [5,1], }),
        tf.layers.inputLayer({inputShape: [5]}),
        tf.layers.dense({units: 32, activation: 'relu'}),
        tf.layers.dense({units: 1, activation: 'softmax'})
      ]
    })
    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd'
    })

    this.lastOrder = {
      price: startingPrice,
      orderType: (Math.random() ? OrderType.BUY : OrderType.SELL)
    }
  }

  Action(moment, time) {
    const predicition = this.model.predict(tf.tensor2d([moment.midPrice, moment.spread, moment.p_k, moment.min, moment.max], [1,5]))
    const orderType = predicition.as1D[0]
    tf.dispose(predicition)
    const price = this.calculatePrice(orderType === OrderType.BUY, moment)
    this.lastOrder = {
      price: price,
      orderType: orderType
    }
    if (orderType === OrderType.BUY &&this.capital < price) {
      return
    }
    return new MarketOrder(orderType, 1, price, time, this.agentID)
  }

  async Learn(moment) {
    tf.dispose(await this.model.trainOnBatch(
      [tf.tensor2d([moment.midPrice, moment.spread, moment.p_k, moment.min, moment.max], [1,5])],
      [tf.tensor1d([this.lastOrder.orderType === OrderType.BUY ? moment.midPrice > this.lastOrder.price : moment.midPrice < this.lastOrder.price])]
    ))
  }

  calculatePrice(buying, moment) {
    let result
    const alpha = 1 + ((moment.p_k))
    result = moment.midPrice + (buying ? 1 : -1) * Math.abs(moment.midPrice- (moment.midPrice/ pow(1 - Math.random(), 1 / (alpha + 1))))
    return max([result, 0])
  }
  
}

