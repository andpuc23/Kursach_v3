package Points;

public class ClusterPoints extends Points implements PointsGenerator{

    int size;
    int centerX1;
    int centerY1;
    int centerX2;
    int centerY2;
    private boolean first;

    public ClusterPoints(int x1, int y1, int x2, int y2, int size){
        this.centerX1 = x1;
        this.centerY1 = y1;
        this.centerX2 = x2;
        this.centerY2 = y2;
        this.size = size;
        first = true;
    }

    @Override
    public Point getPoint() {
        if (first){
            int X = centerX1 + ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
            int Y = centerY1 + ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
            first = !first;
            return new Point(X, Y, 1);
        }
        else{
            int X = centerX2 + ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
            int Y = centerY2 + ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
            first = !first;
            return new Point(X, Y, -1);
        }

    }
}
