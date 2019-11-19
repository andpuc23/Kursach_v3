package Points;

public class ClusterPoints extends Points implements PointsGenerator{

    int size;
    int centerX;
    int centerY;
    int value;

    public ClusterPoints(int x, int y, int size, int value){
        this.centerX = x;
        this.centerY = y;
        this.size = size;
        this.value = value;
    }

    @Override
    public Point getPoint() {
        int X = centerX + ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
        int Y = centerY + ran.nextInt(size)*(ran.nextBoolean() ? 1 : -1);
        return new Point(X, Y, value);
    }
}
