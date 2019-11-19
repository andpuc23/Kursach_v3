package Points;

public class SpiralsPoints extends Points implements PointsGenerator{
    double coeff;

    public SpiralsPoints(double coeff){
        this.coeff = coeff;
    }

    @Override
    public Point getPoint() {
        int k = ran.nextInt(100);
        double ro = k*0.75d;
        double fi = ro*coeff;

        boolean red = ran.nextBoolean();

        if (red)
            return new Point(ro, fi, 1);
        else
            return new Point(ro, fi+Math.PI, -1);
    }
}
