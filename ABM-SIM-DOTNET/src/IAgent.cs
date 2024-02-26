namespace ABMSIM {
    public interface IAgent {
        public MarketOrder? Action(Moment m);
    }
}