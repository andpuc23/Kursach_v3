package ML.MLP;

public interface RegularizationFunction {
    double output(double w);

    //derivative
    double der(double w);
}
