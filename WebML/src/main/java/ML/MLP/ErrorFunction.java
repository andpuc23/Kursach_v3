package ML.MLP;

public interface ErrorFunction {
    double error(double output, double target);
    double der(double output, double target);
}
