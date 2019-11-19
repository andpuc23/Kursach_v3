package Application;

import ML.RBF.Network;
import Points.*;

import java.util.Arrays;

public class ConsoleApp {

    public static void main(String[] args) {
        CirclePoints data = new CirclePoints(75, 100,125);

//        XorPoints data = new XorPoints(100);

//        SpiralsPoints data = new SpiralsPoints(2); //~70%



        Network rbf = new Network( 0.5d, data);

        int numEpochs = 300;
        for (int i = 0; i < numEpochs; i++) {
            rbf.addNeuron();
            System.out.println(rbf.toString());
        }
        int success = 0;
        int total = 0;
        for (int i = 0; i < 500; i++){
            total++;
            if (rbf.test(data.getPoint()))
                success++;
        }
        double accuracy = success*1./total;
        while (accuracy < 0.75){
            rbf.addNeuron();
            total++;
            if (rbf.test(data.getPoint()))
                success++;
            accuracy = success*1./total;
            System.out.println(rbf.toString());
            System.out.println(accuracy*100 + " %");
        }

        System.out.println("\n\ntests\n\n");
        for (int i = 0; i < 300; i++){
            Point p = data.getPoint();
            System.out.println("point:\t" + Arrays.toString(p.getCartesian()) + "; \t" + p.value + ";\t" + rbf.test(p));
        }

        System.out.println(rbf.toString());
        System.out.println(accuracy*100 + " %");
    }


}