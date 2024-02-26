namespace ABMSIM {
    public class TChartist : IAgent {
        private float forgettingFactor;
        private float EWMA;
        public TChartist(float forgettingFactor, float intitalMidPrice) : base() {
            this.forgettingFactor = forgettingFactor;
            EWMA = intitalMidPrice;
        }

        private float getEWMA(float midPrice) {
            EWMA = EWMA + (forgettingFactor) * (EWMA - midPrice);
            return EWMA;
        }

        private float getVolumeConstant(float midPrice) {
            if (Math.Abs(EWMA - midPrice) <= (midPrice) * (2f)) {
                return 20f;
            } else if (Math.Abs(EWMA - midPrice) > (midPrice) * (2f)) {
                return 50f;
            } else {
                return 0f;
            }
        }

        public MarketOrder? Action(Moment m) {
            float EWMA = getEWMA(m.midPrice);
            OrderTypes orderType;
            if (EWMA < m.midPrice - (0.5f) * (m.spread)) {
                orderType = OrderTypes.BUY;
            } else if (EWMA > m.midPrice + (0.5f) * (m.spread)) {
                orderType = OrderTypes.SELL;
            } else {
                return null;
            }
            int volume = (int)Util.calculatePowerLawVolume(orderType == OrderTypes.BUY, getVolumeConstant(m.midPrice), m);
            return new MarketOrder(orderType, volume, EWMA);
        }
    }
}
