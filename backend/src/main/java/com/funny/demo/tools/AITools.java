package com.funny.demo.tools;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
@Component
public class AITools {
    @Tool("获取当前时间")
    public static String dataUtil(){
        return LocalDateTime.now().toString();
    }
}
