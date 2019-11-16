package ML.Functions;

public class Regularizations {
    public static class L1 implements RegularizationFunction {

        public double output(double w) {
            return Math.abs(w);
        }

        public double der(double w) {
            return (w < 0) ? -1 : (w > 0 ? 1 : 0);
        }
    }


    public static class L2 implements RegularizationFunction {

        public double output(double w) {
            return 0.5 * w * w;
        }

        public double der(double w) {
            return w;
        }
    }
}
