package Points;

public class Point{
    private int X;
    private int Y;
    public int value;

    public int[] getCartesian(){
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
    Point(int x, int y, int val){
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
    Point(double ro, double fi, int val){
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

    void setValue(int value){
        this.value = value;
    }

    Double distanceTo(Point other){
        return Math.sqrt((this.X - other.X) * (this.X - other.X) +
                (this.Y - other.Y) * (this.Y - other.Y));
    }
}
