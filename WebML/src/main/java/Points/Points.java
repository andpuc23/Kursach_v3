package Points;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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

    /**
     * creates a field of points, divided vertically and horizontally through center
     * @param pointsNum number of generated points of each type
     * @param size size of square field
     * @param clear if points should be written to an empty list
     */
    void createXor(int pointsNum, int size, boolean clear){
        if (clear)
            points.clear();

        Point center = new Point(0,0,0);
        points.add(center);
        for (int i = 0; i < 2*pointsNum; i++){
            int x = ran.nextInt(size)*(ran.nextInt()%2==0?1:-1);
            int y = ran.nextInt(size)*(ran.nextInt()%2==0?1:-1);
            double val = (x*y > 0) ? 1:-1;
            Point p = new Point(x, y, val);
            points.add(p);
        }
    }

    /**
     * creates a circle ( 0;0 , circleRadius) of points w/ value 1,
     * and ring of radius ringRadius of points w/ -1
     * @param pointsNum number of points per value
     * @param circleRadius size of inner circle
     * @param ringRadius size of outer ring
     * @param clear if points should be written to an empty list
     */
    void createCircle(int pointsNum, int circleRadius, int ringRadius, boolean clear){
        if (clear)
            points.clear();

        Point center = new Point(0,0,0);
        points.add(center);

        for (int i = 0; i < pointsNum; i++){
            int x = (int)(ran.nextDouble() *
                    circleRadius *
                    (ran.nextInt()%2==0?1:-1));

            int y = (int)(ran.nextDouble() * circleRadius * (ran.nextInt()%2==0?1:-1));
            Point p = new Point(x, y, 1);

            if ((p.distanceTo(center)).compareTo((double)circleRadius) != 1)
                points.add(p);
            else
                i--;
        }
        for (int i = 0; i < pointsNum; i++){
            Point p = new Point((double) ringRadius, ran.nextDouble()*Math.PI*2, -1);
            points.add(p);
        }
    }

    void distortPoints(){
        for (Point p : points){
            p.setX(p.getCartesian()[0] +
                    (int)(ran.nextDouble() * 20 * (ran.nextInt()%2==0?1:-1)));
            p.setY(p.getCartesian()[1] +
                    (int)(ran.nextDouble() * 20 * (ran.nextInt()%2==0?1:-1)));
        }
    }
}

class Point{
    private int X;
    private int Y;
    double value;

    int[] getCartesian(){
        return new int[]{X, Y};
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

    void setX(int X){
        this.X = X;
    }

    void setY(int Y){
        this.Y = Y;
    }

    void setValue(double value){
        this.value = value;
    }

    Double distanceTo(Point other){
        return Math.sqrt((this.X - other.X) * (this.X - other.X) +
                (this.Y - other.Y) * (this.Y - other.Y));
    }
}