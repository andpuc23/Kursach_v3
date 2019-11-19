package Points;

public class CirclePoints extends Points implements PointsGenerator{
    private int circleRadius;
    private int ringInner;
    private int ringOuter;

    public CirclePoints(int circleRadius, int ringInner, int ringOuter){
        this.circleRadius = circleRadius;
        this.ringInner = ringInner;
        this.ringOuter = ringOuter;
    }

    @Override
    public Point getPoint() {
        double ro, fi;
        do{
            ro = ran.nextDouble()*ringOuter;
        } while (ro > circleRadius && ro < ringInner);
        fi = ran.nextDouble()*Math.PI*2;

        if (ro < circleRadius)
            return new Point(ro, fi, 1);
        else
            return new Point(ro, fi, -1);
    }
}
