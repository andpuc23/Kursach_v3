package Application;

import ML.Functions.Activations;
import ML.Functions.Errors;
import ML.Functions.Regularizations;
//import ML.RBF.Network;
import ML.MLP.Network;
import Points.*;
import Points.Point;

import java.util.Arrays;

public class ConsoleApp {
//RBF
  /*
   public static void main(String[] args) {
//        CirclePoints data = new CirclePoints(75, 100,125);
        XorPoints data = new XorPoints(100);
//        SpiralsPoints data = new SpiralsPoints(2); //~70%
//        ClusterPoints data = new ClusterPoints(100, 0, -100, 0, 150);

        Network rbf = new Network(0.5d, data);

        int numEpochs = 500;
        for (int i = 0; i < numEpochs; i++) {
            rbf.addNeuron();
            System.out.println(rbf.toString());
        }
        int success = 0;
        int total = 0;
        for (int i = 0; i < 500; i++) {
            total++;
            if (rbf.test(data.getPoint()))
                success++;
        }
        double accuracy = success * 1. / total;
        while (accuracy < 0.7) {
            rbf.addNeuron();
            total++;
            if (rbf.test(data.getPoint()))
                success++;
            accuracy = success * 1. / total;
            System.out.println(rbf.toString());
            System.out.println(accuracy * 100 + " %");
        }

        System.out.println("\n\ntests\n\n");
        for (int i = 0; i < 500; i++) {
            Point p = data.getPoint();
//            System.out.println("point:\t" + Arrays.toString(p.getCartesian()) + "; \t" + p.value + ";\t" + rbf.test(p));
        }

        System.out.println(rbf.toString());
        System.out.println(accuracy * 100 + " %");

        JsonSerializer.serialize(rbf, "RBF_HERE");
        System.out.println("serialized successfully");
//        for (int i = 0; i < 150; i++){
//            for (int j = 0; j < 150; j++){
//                if (rbf.outputForPoint(new Point((j - 75)*2,(i - 75)*2, 0)) > 0 )
//                    System.out.print('*');
//                else
//                    System.out.print('.');
//            }
//            System.out.print("\n");
//        }
    }*/

    //MLP
   //*
    public static void main(String[] args) {
        Network net = new Network(new int[]{2, 10, 1}, new Activations.Linear(),
                new Activations.Tanh(), new Regularizations.L1(), new String[]{"X", "Y"}, false);

        ClusterPoints data = new ClusterPoints(0, 100, 0,-200, 100);
//        CirclePoints data = new CirclePoints(75, 100,125);
//        XorPoints data = new XorPoints(100);
//        SpiralsPoints data = new SpiralsPoints(2); //~70%

        Point[] points = new Point[] {
                new Point(-10,-10,-1),
                new Point(-9,-8,-1),
                new Point(-11,-6,-1),
                new Point(10,6,1),
                new Point(5,13,1),
                new Point(4,17,1),
                new Point(9,7,1),
                new Point(6,7,1),};
        int index = 0;
//        System.out.println(net.structure());
        for (int i = 0; i < 1000; i++){
            Point p = data.getPoint();
          //  if (index==7)
            //    index=0;
           // Point p = points[index];
           // index++;
            net.forwardPropagation(p.getCartesian());
            net.backPropagation(p.value, new Errors.Square());
            net.updateWeights(0.03, 0.01);
        }


//        System.out.println(net.structure());
        System.out.println("\n\ntests\n\n");
        int success = 0, total = 0;
        for (int i = 0; i < 1000; i++) {
            Point p = data.getPoint();
         //   if (index==7)
       //         index=0;
     //       Point p = points[index];
   //         index++;
            System.out.println("point : " + p.toString()+ "; net output: " + net.outputForPoint(p));
//            System.out.println("point:\t" + Arrays.toString(p.getCartesian()) + "; \t" + p.value + ";\t" + net.test(p));
            total++;
            if (net.test(p))
                success ++;
        }
        System.out.print("accuracy: " + success*100d/total + " %");

        net.structure();

    }
//*/
}