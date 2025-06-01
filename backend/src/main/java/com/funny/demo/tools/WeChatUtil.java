package com.funny.demo.tools;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
@Component
public class WeChatUtil {
    private static String appid = "wxf9ac121f6797029f";
    private static String secret="78ad8f60d3d686eda0822abfc8c8c8f9";

    public static String getAppid() {
        return appid;
    }

    public static void setAppid(String appid) {
        WeChatUtil.appid = appid;
    }

    public static String getSecret() {
        return secret;
    }

    public static void setSecret(String secret) {
        WeChatUtil.secret = secret;
    }

    public static String GetOpenid(String code){
        String url = "https://api.weixin.qq.com/sns/jscode2session";//指定URL
        Map<String, Object> map = new HashMap<>();//存放参数
        map.put("appid", WeChatUtil.getAppid());
        map.put("secret", WeChatUtil.getSecret());
        map.put("js_code",code);
        map.put("grant_type","authorization_code");
        //发送get请求并接收响应数据
        String result= HttpUtil.createGet(url).form(map).execute().body();
        return SecureUtil.md5(JSONUtil.parseObj(result).get("openid").toString());
    }
}
