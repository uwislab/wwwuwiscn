package org.example.springbootrobot.util;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//全局配置配置类--配置跨域请求
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 1.与访问路径
     * 2.请求来源
     * 3.方法
     * 4.允许携带
     * 5.响应最大时间
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("Http://localhost:8080","null")
                .allowedMethods("GET","HEAD","POST","PUT","DELETE","OPTIONS")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
