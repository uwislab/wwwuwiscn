package com.funny.demo.config;

import com.funny.demo.tools.JwtInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Override
    // 加自定义拦截器JwtInterceptor，设置拦截规则
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtInterceptor())
                .addPathPatterns("/funnyManage/**") //拦截所有请求，通过判断token是否合法来决定是否登录
                .excludePathPatterns("/funnyManage/admin/login","/funny/**");//排除这些接口，也就是说，这些接口可以放行
    }
}
