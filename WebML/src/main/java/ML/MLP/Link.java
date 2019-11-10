package ML.MLP;

import java.util.ArrayList;
import java.util.List;

public class Link {
    String id;
    Neuron source;
    Neuron destination;
    double weight;

    //error derivative with respect to its weight
    double errorDeriv;

    //accumulated error derivative since the last update
    double accErrorDeriv;

    //number of accumulated derivatives since the last update
    int numAccDerivs;

    boolean isDead;

    RegularizationFunction regularization;

    boolean isL1;
    boolean isL2;

    public Link(Neuron source, Neuron dest, RegularizationFunction reg, boolean initZero){
        id = source.id + " to " + dest.id;
        this.source = source;
        this.destination = dest;
        this.regularization = reg;
        this.isDead = false;
        if (initZero)
            this.weight = 0;
    }

    public static void main(String[] args) {
        Neuron a = new Neuron("a", new Activations.Linear(), false);
        Neuron b = new Neuron("b", new Activations.Linear(), false);
        Link l1 = new Link(a, b, new Regularizations.L1(), false);


        System.out.println(Regularizations.L1.class);
        System.out.println(l1.regularization.getClass());
        System.out.println(l1.regularization.equals(new Regularizations.L1()));

    }
}
