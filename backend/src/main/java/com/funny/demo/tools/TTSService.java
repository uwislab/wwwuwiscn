package com.funny.demo.tools;

import com.google.gson.Gson;
import okhttp3.HttpUrl;
import org.java_websocket.WebSocket;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
/**
 * 语音合成服务类，生成临时语音文件并返回文件对象
 */
public class TTSService {
    // 地址与鉴权信息（从配置或环境变量获取，此处保留示例）
    public static final String hostUrl = "https://tts-api.xfyun.cn/v2/tts";
    public static final String APPID = "6684d585";
    public static final String APISecret = "YjU5Yjg4MGU5NGRmNjU4MWJhYzQ4ZDc2";
    public static final String APIKey = "e663a167f4925ee26d11512fc0855362";
    public static final String TTE = "UTF8";
    public static final String VCN = "xiaoyan";

    private static final Gson gson = new Gson();
    private static final AtomicReference<Boolean> wsCloseFlag = new AtomicReference<>(false);

    /**
     * 语音合成主方法，返回临时文件对象
     * @param text 待合成文本
     * @return 临时语音文件对象
     * @throws Exception 合成过程异常
     */
    public static File tts(String text) throws Exception {
        // 创建临时文件
        File tempFile = File.createTempFile("tts_", ".mp3");

        String wsUrl = getAuthUrl(hostUrl, APIKey, APISecret).replace("https://", "wss://");
        try (OutputStream outputStream = new FileOutputStream(tempFile)) {
            websocketWork(wsUrl, outputStream, text);
        }
        return tempFile;
    }

    /**
     * WebSocket连接处理
     */
    private static void websocketWork(String wsUrl, OutputStream outputStream, String message) throws Exception {
        URI uri = new URI(wsUrl);
        WebSocketClient webSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake serverHandshake) {
                System.out.println("WebSocket连接成功");
            }

            @Override
            public void onMessage(String text) {
                handleResponse(text, outputStream);
                if (text.contains("\"status\":2")) {
                    wsCloseFlag.set(true);
                    this.close();
                }
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                System.out.println("WebSocket关闭，code: " + code + ", reason: " + reason);
            }

            @Override
            public void onError(Exception e) {
                System.out.println("WebSocket错误: " + e.getMessage());
                wsCloseFlag.set(true);
            }
        };

        webSocketClient.connect();
        while (!webSocketClient.getReadyState().equals(WebSocket.READYSTATE.OPEN)) {
            Thread.sleep(100);
        }

        MyThread webSocketThread = new MyThread(webSocketClient, message);
        webSocketThread.start();
        // 等待连接关闭
        while (!wsCloseFlag.get()) {
            Thread.sleep(200);
        }
        webSocketClient.close();
    }

    /**
     * 处理响应数据
     */
    private static void handleResponse(String text, OutputStream outputStream) {
        try {
            JsonParse myJsonParse = gson.fromJson(text, JsonParse.class);
            if (myJsonParse.code != 0) {
                System.out.println("合成错误，错误码: " + myJsonParse.code);
                return;
            }
            if (myJsonParse.data != null && myJsonParse.data.audio != null) {
                byte[] audioData = Base64.getDecoder().decode(myJsonParse.data.audio);
                outputStream.write(audioData);
                outputStream.flush();
            }
        } catch (Exception e) {
            System.out.println("响应处理错误: " + e.getMessage());
        }
    }

    // 线程类发送请求参数
    static class MyThread extends Thread {
        private final WebSocketClient webSocketClient;
        private final String text;

        MyThread(WebSocketClient webSocketClient, String text) {
            this.webSocketClient = webSocketClient;
            this.text = text;
        }

        @Override
        public void run() {
            if (webSocketClient != null && webSocketClient.isOpen()) {
                String requestJson = buildRequestJson(text);
                webSocketClient.send(requestJson);
            }else {
                System.out.println("WebSocket 连接未打开，尝试重新连接...");
                // 尝试重新连接
                if (webSocketClient != null && webSocketClient.getReadyState().equals(WebSocketClient.READYSTATE.CLOSED)) {
                    webSocketClient.reconnect();
                    String requestJson = buildRequestJson(text);
                    webSocketClient.send(requestJson);
                }
            }
        }

        private String buildRequestJson(String text) {
            return "{\n" +
                    "  \"common\": {\"app_id\": \"" + APPID + "\"},\n" +
                    "  \"business\": {\n" +
                    "    \"aue\": \"lame\",\n" +
                    "    \"sfl\": 1,\n" +
                    "    \"tte\": \"" + TTE + "\",\n" +
                    "    \"ent\": \"intp65\",\n" +
                    "    \"vcn\": \"" + VCN + "\",\n" +
                    "    \"pitch\": 50,\n" +
                    "    \"speed\": 50\n" +
                    "  },\n" +
                    "  \"data\": {\n" +
                    "    \"status\": 2,\n" +
                    "    \"text\": \"" + Base64.getEncoder().encodeToString(text.getBytes(StandardCharsets.UTF_8)) + "\"\n" +
                    "  }\n" +
                    "}";
        }
    }

    // 鉴权方法（保持不变）
    private static String getAuthUrl(String hostUrl, String apiKey, String apiSecret) throws Exception {
        URL url = new URL(hostUrl);
        SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("GMT"));
        String date = format.format(new Date());

        String preStr = "host: " + url.getHost() + "\n" +
                "date: " + date + "\n" +
                "GET " + url.getPath() + " HTTP/1.1";

        Mac mac = Mac.getInstance("hmacsha256");
        SecretKeySpec spec = new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8), "hmacsha256");
        mac.init(spec);
        byte[] hexDigits = mac.doFinal(preStr.getBytes(StandardCharsets.UTF_8));
        String sha = Base64.getEncoder().encodeToString(hexDigits);

        String authorization = String.format("api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"",
                apiKey, "hmac-sha256", "host date request-line", sha);

        return HttpUrl.parse("https://" + url.getHost() + url.getPath())
                .newBuilder()
                .addQueryParameter("authorization", Base64.getEncoder().encodeToString(authorization.getBytes()))
                .addQueryParameter("date", date)
                .addQueryParameter("host", url.getHost())
                .build()
                .toString()
                .replace("https://", "wss://");
    }

    // JSON解析类（内部类改为静态）
    static class JsonParse {
        int code;
        String sid;
        Data data;
    }

    static class Data {
        int status;
        String audio;
    }
}