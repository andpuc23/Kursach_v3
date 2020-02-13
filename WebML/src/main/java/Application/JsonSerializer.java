package Application;

import ML.INetwork;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import java.io.*;

public class JsonSerializer {

    public static void serialize(INetwork net, String fileName){
        String result = new Gson().toJson(net);
        try {
            BufferedWriter bw = new BufferedWriter(new FileWriter(fileName+".json"));
            bw.write(result);
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static <T extends INetwork> T deserialize(String filename) throws FileNotFoundException {
        filename += ".json";
        if (new File(filename).exists()) {
            return (T)new Gson().fromJson(filename, INetwork.class);
        }
        else throw new FileNotFoundException("Network not found");
    }
}


