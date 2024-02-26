namespace ABMSIM {
    public class TFundamentalist : IAgent {
        private int fundamentalistPrice;
        public TFundamentalist(int fundamentalistPrice) : base() {
            this.fundamentalistPrice = fundamentalistPrice;
        }

        private float getVolumeConstant(float midPrice) {
            if (Math.Abs(fundamentalistPrice - midPrice) <= (midPrice) * (2f)) {
                return 20f;
            } else if (Math.Abs(fundamentalistPrice - midPrice) > (midPrice) * (2f)) {
                return 50f;
            } else {
                return 0f;
            }
        }

        public MarketOrder? Action(Moment m) {
            OrderTypes orderType;
            if (fundamentalistPrice < m.midPrice - (0.5f) * (m.spread)) {
                orderType = OrderTypes.BUY;
            } else if (fundamentalistPrice > m.midPrice + (0.5f) * (m.spread)) {
                orderType = OrderTypes.SELL;
            } else {
                return null;
            }
            int volume = (int)Util.calculatePowerLawVolume(orderType == OrderTypes.BUY, getVolumeConstant(m.midPrice), m);
            return new MarketOrder(orderType, volume, fundamentalistPrice);
        }
    }
}
