package com.funny.demo.tools;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class CreateRandom {
    public static String generateRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int digit = random.nextInt(10); // 生成0到9之间的随机数
            sb.append(digit);
        }
        return sb.toString();
    }
}
