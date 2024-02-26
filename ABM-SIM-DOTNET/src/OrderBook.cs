namespace ABMSIM {
    public class OrderBook {
        public readonly List<MarketOrder> bids;
        public readonly List<MarketOrder> asks;

        public OrderBook() {
            bids = new List<MarketOrder>();
            asks = new List<MarketOrder>();
        }
    }
}
