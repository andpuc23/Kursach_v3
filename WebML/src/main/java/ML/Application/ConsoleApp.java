package ML.Application;

import ML.RBF.Network;
import Points.Points;

import java.io.IOException;

public class ConsoleApp {

    public static void main(String[] args) {
        Points data = new Points();
        data.createCircle(500, 250, 450, true);
        data.splitPoints(0.5d);

        Network rbf = new Network(data.training);

        int numEpochs = 200;
        for (int i = 0; i < numEpochs; i++){
            rbf.updateWeights();
            System.out.println(rbf.toString());
            try {
                System.in.read(); //wait for input to start another epoch
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        int success = 0;
        for (int i = 0; i < data.test.size(); i++){
            if (rbf.test(data.test.get(i)))
                success++;
        }
        System.out.println("successful tests " + success + " out of " + data.training.size());
    }
}
