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
        System.out.println("Enter 1 to draw two clusters or 2 to draw spirals; 0 to exit");
        int choise = 0;
        do {
            java.io.BufferedReader in = new java.io.BufferedReader(
                    new java.io.InputStreamReader(System.in));

            try {
                choise = Integer.parseInt(in.readLine());
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (choise == 1) {
                System.out.println("Drawing clusters");
                new Board("clusters");
            } else if (choise == 2) {
                System.out.println("Drawing spirals");
                new Board("spirals");
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
        else
            list.createSpirals(0.025, 500);
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
        for (Point p : list.points){
            g2.setColor(p.value > 0 ? Color.BLUE : Color.RED);
            g2.drawOval((int)(p.getCartesian()[0])+500,
                    (int)(p.getCartesian()[1]) + 400, 5,5);
        }
    }
}