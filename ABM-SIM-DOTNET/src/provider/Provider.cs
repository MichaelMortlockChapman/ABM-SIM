using MathNet.Numerics;
using MathNet.Numerics.Distributions;

namespace ABMSIM {
    public class Provider : IAgent {
        private static Random rand = new Random();

        public static double calculatePrice(bool buying, Moment m) {
            double n = Math.Floor(SpecialFunctions.Gamma(m.p_k));
            return buying ? m.bestOffer - 1 - n : m.bestBid + 1 + n;
        }

        public MarketOrder? Action(Moment m) {
            OrderTypes orderType;
            float price;
            if (rand.Next(0, 100) > (0.5f) * (m.p_k + 1)) {
                orderType = OrderTypes.BUY;
                price = (float)calculatePrice(true, m);
            } else {
                orderType = OrderTypes.SELL;
                price = (float)calculatePrice(false, m);
            }
            int volume = (int)Util.calculatePowerLawVolume(orderType == OrderTypes.BUY, price, m);
            return new MarketOrder(orderType, volume, price);
        }
    }
}

