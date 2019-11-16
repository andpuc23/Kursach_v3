package ML.Functions;

public interface RegularizationFunction {
    double output(double w);

    //derivative
    double der(double w);
}
