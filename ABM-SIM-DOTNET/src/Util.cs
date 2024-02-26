using MathNet.Numerics.Distributions;

namespace ABMSIM {
    public class Util {
        private static readonly float v = 2;
        private static Random rand = new Random();
        public static double calculatePowerLawVolume(bool buying, float x, Moment m) {
            float alpha = 1 + ((m.p_k) * (buying ? 1 : -1)) / (v);
            return x / Math.Pow(1 - rand.NextDouble(), 1.0 / (alpha + 1));
        }
    }
}
