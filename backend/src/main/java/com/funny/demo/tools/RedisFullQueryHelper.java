package com.funny.demo.tools;


import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class RedisFullQueryHelper {

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisSerializer<String> stringSerializer;

    // 注入RedisTemplate（使用String序列化器）
    public RedisFullQueryHelper(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.stringSerializer = redisTemplate.getStringSerializer();
    }
//    获取指定索引（键前缀）下所有数据的text字段值
    public List<String> getAllTextByKeyPattern() {
        String keyPattern = "*";
        List<String> textList = new ArrayList<>();

        // 1. 使用keys()获取所有匹配的键
        Set<String> keys = redisTemplate.keys(keyPattern);
        if (keys == null || keys.isEmpty()) {
            return textList;
        }

        // 2. 遍历每个键，提取text字段
        for (String key : keys) {
            // 执行JSON.GET命令，获取text字段（路径为".text"）
            // 通过execute方法执行自定义命令。
            String text = redisTemplate.execute((RedisCallback<String>) connection -> {
                byte[] keyBytes = stringSerializer.serialize(key);
                byte[] pathBytes = stringSerializer.serialize(".text");

                // 将命令和参数构造成byte[][]数组传入
                byte[][] params = new byte[][]{keyBytes, pathBytes};

                // 执行命令：JSON.GET key ".text"
                Object result = connection.execute("JSON.GET", params);  // 先接收为Object

                // 转换为byte[]并反序列化
                if (result instanceof byte[]) {
                    return stringSerializer.deserialize((byte[]) result);
                } else if (result != null) {
                    System.out.println("not instanceof byte");
                    return result.toString();
                }
                return null;
            });

            if (text != null) {
                textList.add(text);
            }
        }

        return textList;
    }

}