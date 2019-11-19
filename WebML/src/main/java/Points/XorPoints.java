package Points;

public class XorPoints extends Points implements PointsGenerator{
    int size;
    public XorPoints(int size){
        this.size = size;
    }

    @Override
    public Point getPoint() {
        int x = ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
        int y = ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);

        return new Point(x,y, x*y>0?1:-1);
    }
}
