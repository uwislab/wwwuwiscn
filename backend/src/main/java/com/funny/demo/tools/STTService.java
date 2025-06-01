package com.funny.demo.tools;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CountDownLatch;

@Service
public class STTService {
    private static final String hostUrl = "https://iat-api.xfyun.cn/v2/iat";
    private static final String appid = "6684d585";
    private static final String apiSecret = "YjU5Yjg4MGU5NGRmNjU4MWJhYzQ4ZDc2";
    private static final String apiKey = "e663a167f4925ee26d11512fc0855362";
    private static final Gson json = new Gson();
    private static final OkHttpClient sharedClient = new OkHttpClient(); // 复用Client

    public String recognize(File audioFile) throws Exception {
        // 每个请求创建独立的上下文
        RecognitionContext context = new RecognitionContext();
        String authUrl = getAuthUrl(hostUrl, apiKey, apiSecret);
        String url = authUrl.replace("https://", "wss://");
        Request request = new Request.Builder().url(url).tag(audioFile).build();

        // 使用独立的WebSocket监听器
        WebSocketListener listener = new RecognitionWebSocketListener(audioFile, context);
        WebSocket webSocket = sharedClient.newWebSocket(request, listener);

        try {
            context.latch.await(); // 等待当前请求完成
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("识别被中断", e);
        }
        return context.finalResult != null ? context.finalResult : "";
    }

    // 每个请求的独立上下文
    private static class RecognitionContext {
        final CountDownLatch latch = new CountDownLatch(1);
        String finalResult;
    }

    // 独立的WebSocket监听器（非共享）
    private static class RecognitionWebSocketListener extends WebSocketListener {
        private final File audioFile;
        private final RecognitionContext context;
        private final Decoder decoder = new Decoder();
        private WebSocket webSocket;

        public RecognitionWebSocketListener(File audioFile, RecognitionContext context) {
            this.audioFile = audioFile;
            this.context = context;
        }

        @Override
        public void onOpen(WebSocket webSocket, Response response) {
            this.webSocket = webSocket;
            new Thread(() -> sendAudioData(webSocket)).start();
        }

        private void sendAudioData(WebSocket webSocket) {
            int frameSize = 1280;
            int interval = 40;
            int status = StatusFirstFrame;

            try (FileInputStream fs = new FileInputStream(audioFile)) {
                byte[] buffer = new byte[frameSize];
                while (true) {
                    int len = fs.read(buffer);
                    if (len == -1) {
                        status = StatusLastFrame;
                    }

                    JsonObject frame = new JsonObject();
                    JsonObject data = new JsonObject();
                    data.addProperty("status", status);
                    data.addProperty("format", "audio/L16;rate=16000");
                    data.addProperty("encoding", "lame");

                    if (status != StatusLastFrame) {
                        data.addProperty("audio", Base64.getEncoder().encodeToString(Arrays.copyOf(buffer, len)));
                    } else {
                        data.addProperty("audio", "");
                    }

                    if (status == StatusFirstFrame) {
                        JsonObject common = new JsonObject();
                        common.addProperty("app_id", appid);
                        frame.add("common", common);

                        JsonObject business = new JsonObject();
                        business.addProperty("language", "zh_cn");
                        business.addProperty("domain", "iat");
                        frame.add("business", business);
                    }

                    frame.add("data", data);
                    webSocket.send(frame.toString());

                    if (status == StatusLastFrame) break;
                    status = StatusContinueFrame;
                    Thread.sleep(interval);
                }
            } catch (IOException | InterruptedException e) {
                context.finalResult = "";
                context.latch.countDown();
            }
        }

        @Override
        public void onMessage(WebSocket webSocket, String text) {
            try {
                ResponseData resp = json.fromJson(text, ResponseData.class);
                if (resp == null) return;

                if (resp.getCode() != 0) {
                    System.err.println("识别错误: " + resp.getMessage());
                    context.finalResult = "";
                    context.latch.countDown();
                    return;
                }

                if (resp.getData() != null && resp.getData().getResult() != null) {
                    Text textObj = resp.getData().getResult().getText();
                    decoder.decode(textObj);
                }

                if (resp.getData() != null && resp.getData().getStatus() == 2) {
                    context.finalResult = decoder.toString();
                    decoder.discard(); // 清理状态
                    context.latch.countDown();
                    webSocket.close(1000, "正常关闭");
                }
            } catch (Exception e) {
                context.finalResult = "";
                context.latch.countDown();
            }
        }

        @Override
        public void onFailure(WebSocket webSocket, Throwable t, Response response) {
            context.finalResult = "";
            context.latch.countDown();
        }

        @Override
        public void onClosed(WebSocket webSocket, int code, String reason) {
            context.latch.countDown();
        }

        private static final int StatusFirstFrame = 0;
        private static final int StatusContinueFrame = 1;
        private static final int StatusLastFrame = 2;
    }

    //工具类和数据类
    public static String getAuthUrl(String hostUrl, String apiKey, String apiSecret) throws Exception {
        URL url = new URL(hostUrl);
        SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("GMT"));
        String date = format.format(new Date());
        StringBuilder builder = new StringBuilder("host: ").append(url.getHost()).append("\n")
                .append("date: ").append(date).append("\n")
                .append("GET ").append(url.getPath()).append(" HTTP/1.1");
        Charset charset = Charset.forName("UTF-8");
        Mac mac = Mac.getInstance("hmacsha256");
        SecretKeySpec spec = new SecretKeySpec(apiSecret.getBytes(charset), "hmacsha256");
        mac.init(spec);
        byte[] hexDigits = mac.doFinal(builder.toString().getBytes(charset));
        String sha = Base64.getEncoder().encodeToString(hexDigits);
        String authorization = String.format("api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"", apiKey, "hmac-sha256", "host date request-line", sha);
        HttpUrl httpUrl = HttpUrl.parse("https://" + url.getHost() + url.getPath()).newBuilder()
                .addQueryParameter("authorization", Base64.getEncoder().encodeToString(authorization.getBytes(charset)))
                .addQueryParameter("date", date)
                .addQueryParameter("host", url.getHost())
                .build();
        return httpUrl.toString();
    }

    public static class ResponseData {
        private int code;
        private String message;
        private String sid;
        private Data data;

        public int getCode() {
            return code;
        }

        public String getMessage() {
            return this.message;
        }

        public String getSid() {
            return sid;
        }

        public Data getData() {
            return data;
        }
    }

    public static class Data {
        private int status;
        private Result result;

        public int getStatus() {
            return status;
        }

        public Result getResult() {
            return result;
        }
    }

    public static class Result {
        int bg;
        int ed;
        String pgs;
        int[] rg;
        int sn;
        Ws[] ws;
        boolean ls;
        JsonObject vad;

        public Text getText() {
            Text text = new Text();
            StringBuilder sb = new StringBuilder();
            if (ws != null) {
                for (Ws wsItem : ws) {
                    if (wsItem.cw != null) {
                        for (Cw cw : wsItem.cw) {
                            sb.append(cw.w);
                        }
                    }
                }
            }
            text.sn = this.sn;
            text.text = sb.toString();
            text.sn = this.sn;
            text.rg = this.rg;
            text.pgs = this.pgs;
            text.bg = this.bg;
            text.ed = this.ed;
            text.ls = this.ls;
            text.vad = this.vad == null ? null : this.vad;
            return text;
        }
    }

    public static class Ws {
        Cw[] cw;
        int bg;
        int ed;
    }

    public static class Cw {
        int sc;
        String w;
    }

    public static class Text {
        int sn;
        int bg;
        int ed;
        String text;
        String pgs;
        int[] rg;
        boolean deleted;
        boolean ls;
        JsonObject vad;

        @Override
        public String toString() {
            return "Text{" +
                    "bg=" + bg +
                    ", ed=" + ed +
                    ", ls=" + ls +
                    ", sn=" + sn +
                    ", text='" + text + '\'' +
                    ", pgs=" + pgs +
                    ", rg=" + Arrays.toString(rg) +
                    ", deleted=" + deleted +
                    ", vad=" + (vad == null ? "null" : vad.getAsJsonArray("ws").toString()) +
                    '}';
        }
    }

    //解析返回数据，仅供参考
    public static class Decoder {
        private Text[] texts;
        private int defc = 10;

        public Decoder() {
            this.texts = new Text[this.defc];
        }

        public synchronized void decode(Text text) {
            if (text.sn >= this.defc) {
                this.resize();
            }
            if ("rpl".equals(text.pgs)) {
                for (int i = text.rg[0]; i <= text.rg[1]; i++) {
                    this.texts[i].deleted = true;
                }
            }
            this.texts[text.sn] = text;
        }

        public String toString() {
            StringBuilder sb = new StringBuilder();
            for (Text t : this.texts) {
                if (t != null && !t.deleted) {
                    sb.append(t.text);
                }
            }
            return sb.toString();
        }

        public void resize() {
            int oc = this.defc;
            this.defc <<= 1;
            Text[] old = this.texts;
            this.texts = new Text[this.defc];
            for (int i = 0; i < oc; i++) {
                this.texts[i] = old[i];
            }
        }

        public void discard() {
            for (int i = 0; i < this.texts.length; i++) {
                this.texts[i] = null;
            }
        }
    }
}