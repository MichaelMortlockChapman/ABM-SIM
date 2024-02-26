namespace ABMSIM {
    public enum OrderTypes {
        BUY, SELL
    }

    public class MarketOrder {
        public readonly OrderTypes orderType;
        public readonly int volume;
        public readonly float price;

        public MarketOrder(OrderTypes orderType, int volume, float price) {
            this.orderType = orderType;
            this.volume = volume;
            this.price = price;
        }
    }
}
