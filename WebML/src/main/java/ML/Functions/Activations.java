package ML.Functions;

public class Activations {
    public static class Linear implements ActivationFunction {
        public double output(double x) {
            return x;
        }

        public double der(double x) {
            return 1;
        }
    }

    public static class Relu implements ActivationFunction {

        public double output(double x) {
            return Math.max(0, x);
        }

        public double der(double x) {
            return (x <= 0) ? 0 : 1;
        }
    }

    public static class Sigmoid implements ActivationFunction {
        public double output(double x) {
            return 1 / (1 + Math.exp(x));
        }

        public double der(double x) {
            return output(x) * (1 - output(x));
        }
    }

    public static class Tanh implements ActivationFunction {

        public double output(double x) {
            return Math.tanh(x);
        }

        public double der(double x) {
            return 1 - output(x) * output(x);
        }
    }
}