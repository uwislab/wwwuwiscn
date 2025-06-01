package com.funny.demo.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@Data
public class RobotConfig {
    private String apiUrl;
    public RobotConfig(){
        apiUrl = "http://127.0.0.1:8080/robot.html";
    }
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}