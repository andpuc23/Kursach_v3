package ML.Functions;

public interface ActivationFunction {
    double output(double x);

    double der(double x);
}
