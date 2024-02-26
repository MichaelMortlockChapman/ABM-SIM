using MathNet;
using MathNet.Numerics.Statistics;

namespace ABMSIM {
    public class Moment {
        public readonly double mean;
        public readonly double stddev;
        public readonly float midPrice;
        public readonly float spread;

        public readonly float p_k;
        public readonly float bestOffer;
        public readonly float bestBid;

        public Moment(OrderBook ob) {
            List<float> Bidprices = ob.bids.Select(o => o.price).ToList();
            List<float> Askprices = ob.asks.Select(o => o.price).ToList();

            mean = Bidprices.Average();
            stddev = Bidprices.StandardDeviation();
            midPrice = Bidprices.Median();

            bestBid = Askprices.Min();
            bestOffer = Bidprices.Max();
            spread = Math.Abs(bestBid - bestOffer);
        }
    }
}
