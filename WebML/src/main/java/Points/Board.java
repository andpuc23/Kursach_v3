package Points;

import javax.swing.*;
import java.awt.*;
import java.io.IOException;

public class Board extends JFrame {

    MyPanel panel;

    private Board(String param){
        setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);

        Dimension dim = Toolkit.getDefaultToolkit().getScreenSize();
        int x = (int)(dim.getWidth()/2);
        int y = (int)(dim.getHeight()/2);

        setLocation(x/2, y/2);
        setSize(x,y);

        panel = new MyPanel(param);
        getContentPane().add(panel);

        setVisible(true);
    }


    public static void main(String[] args) {
        System.out.println("Enter:\n" +
                "1 to draw two clusters\n" +
                "2 to draw spirals\n" +
                "3 to draw xor-thing\n" +
                "4 to draw circle and ring\n" +
                "0 to exit");
        int choise = 0;
        do {
            java.io.BufferedReader in = new java.io.BufferedReader(
                    new java.io.InputStreamReader(System.in));

            try {
                choise = Integer.parseInt(in.readLine());
            } catch (IOException e) {
                e.printStackTrace();
            }
            switch (choise) {
                case 1:
                    System.out.println("Drawing clusters");
                    new Board("clusters");
                    break;

                case 2:
                    System.out.println("Drawing spirals");
                    new Board("spirals");
                    break;

                case 3:
                    System.out.println("Drawing XOR");
                    new Board("xor");
                    break;

                case 4:
                    System.out.println("Drawing circle");
                    new Board("circle");
                    break;
                default:
                    break;
            }
        } while (choise != 0);
    }
}

class MyPanel extends JPanel {
    Points list;
    MyPanel(String param) {
        super();
        setBackground(Color.BLACK);
        list = new Points();

        if (param.equals("clusters")){
            list.createCluster(0,0, 1, 200, 500, true);
            list.createCluster(0,150, -1, 150, 450, false);
        }
        else if (param.equals("spirals"))
            list.createSpirals(0.025, 500);

        else if (param.equals("xor"))
            list.createXor(1000, 500, true);

        else if (param.equals("circle"))
            list.createCircle(1000, 150, 300, true);

        else
            System.out.println("unknown parameter");
        list.distortPoints();

    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);
        Graphics2D g2 = (Graphics2D)g;
        paintPoints(g2);
    }

    void paintPoints(Graphics2D g2){
        g2.setColor(Color.WHITE);
        g2.drawOval(500,400,5,5);
        g2.fillOval(500,400,5,5);
        for (Point p : list.points){
            g2.setColor(p.value > 0 ? Color.BLUE : Color.RED);
            g2.drawOval(p.getCartesian()[0]+500,
                    p.getCartesian()[1] + 400, 5,5);
            g2.fillOval(p.getCartesian()[0]+500,
                    p.getCartesian()[1] + 400, 5,5);

        }
    }
}