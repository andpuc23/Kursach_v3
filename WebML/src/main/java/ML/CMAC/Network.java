package ML.CMAC;

import ML.INetwork;

import java.util.Arrays;

public class Network implements INetwork {
    int ro;
    int mu1, mu2;
    int x1max, x2max;
    int[][][] W;
    int memorySize;

    public Network(int ro, int mu1, int mu2){
        this.ro = ro;

        this.mu1 = (mu1 + ro - 2) / ro + 1;
        this.mu2 = (mu2 + ro - 2) / ro + 1;

        x1max = (mu1 - 1) * ro + 1;
        x2max = (mu2 - 1) * ro + 1;

        memorySize = ro*mu1*mu2;

        this.W = new int[ro][][];
        for (int i = 0; i < ro; i++){
            W[i] = new int[mu1][];
            for (int j = 0; j < mu1; j++){
                W[i][j] = new int[mu2];
            }
        }
    }

    @Override
    public String toString(){
        return "CMAC nn\n" +
                "ro: " + this.ro + "\n" +
                "mu: " + mu1 + "\t" + mu2 + "\n" +
                "xmax: " + x1max + "\t" + x2max + "\n" +
                "memory: " + Arrays.deepToString(W) + "\n" +
                "memory size: " + this.memorySize;
    }

    int[] active(int P0, int P1){
        int c10 = (int)((P0-1.)/this.ro);
        int c11 = (int)((P1-1.)/this.ro);

        int m0 = P0-1 % this.ro;
        int m1 = P1-1 % this.ro;

        int[][] c = new int[ro][];
        for (int i = 0; i < ro; i++)
            c[i] = new int[2];

        int mucp1 =this.ro * mu2;
        int[] mucp = new int[]{mucp1, 1};

        int c20 = c10 + 1;
        int c21 = c11 + 1;

        int c30 = mucp[0] * c20 + 1;
        int c31 = mucp[1] * c21 + 1;

        c[0]
    }

    private int mod(int a, int b){
        if (a%b == 0)
            return b;
        else
            return a%b;
    }


    public static void main(String[] args) {
        Network cmac = new Network(16, 129,129);
        System.out.println(cmac.toString());
    }
}
