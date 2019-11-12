package Points;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// TODO add distortion
public class Points extends ArrayList<Point>{
    List<Point> points;

    Points(){
        points = new ArrayList<Point>();
    }
    private static Random ran = new Random();
    /**
     * creates two spirals starting at (0;0)
     * @param k coef-t in ro = k*phi
     * @param pointsNum number of points in single spiral
     */
    void createSpirals(double k, int pointsNum){
        points.clear();
        for (int i = 0; i < pointsNum; i++){
            double ro = i*0.75d;
            double phi = ro*k;
            Point p = new Point(ro, phi, 1);
            Point q = new Point(ro, phi + Math.PI, -1);
            points.add(p);
            points.add(q);
        }
    }

    /**
     * creates area filled with points
     * @param cX coord. of cluster's center
     * @param cY coord. of cluster's center
     * @param value values of points
     * @param size linear size of cluster
     * @param pointsNum number of points in cluster
     */
    void createCluster(int cX, int cY, int value, int size, int pointsNum, boolean clear){
        if (clear)
            points.clear();
        Point center = new Point(cX, cY, 0);
        for (int i = 0; i < pointsNum; i++){
            int x = cX + (int)(ran.nextDouble()* //coefficient
                    size* // max size
                    (ran.nextInt()%2==0?1:-1)); //+ or -1

            int y = cY + (int)(ran.nextDouble() * size * (ran.nextInt()%2==0?1:-1));
            Point p = new Point(x, y, value);
            if ((p.distanceTo(center)).compareTo((double)size) != 1)
                points.add(new Point(x, y, value));
            else
                i--; //try again
        }
    }
}

class Point{
    private int X;
    private int Y;
    double value;

    double[] getCartesian(){
        return new double[]{X, Y};
    }

    double[] getPolar(){
        double ro = X*X + Y*Y;
        double phi = Math.atan2(Y, X);
        return new double[]{Math.sqrt(ro), phi};
    }

    /**
      * accepts cartesian coordinates as params
     */
    Point(int x, int y, double val){
        X = x;
        Y = y;
        value = val;
    }

    /**
     * accepts polar coordinates of points
     * @param ro distance to the zero of axis
     * @param fi angle
     * @param val value of point
     */
    Point(double ro, double fi, double val){
        X = (int) (ro * Math.sin(fi));
        Y = (int) (ro * Math.cos(fi));
        value = val;
    }

    Double distanceTo(Point other){
        return Math.sqrt((this.X - other.X) * (this.X - other.X) +
                (this.Y - other.Y) * (this.Y - other.Y));
    }
}