package ML.MLP;

public class Errors {
    static class Square implements ErrorFunction{

        public double error(double output, double target) {
            return 0.5*Math.pow(output-target, 2);
        }

        public double der(double output, double target) {
            return output-target;
        }
    }
}
