package com.funny.demo.tools;

import cn.hutool.core.util.StrUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.funny.demo.entity.Admin;
import com.funny.demo.mapper.adminMapper.AdminMapper;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.HandlerMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {
    @Value("${jwt.secret}")
    private String secretKey;

    private static String secret;

    @Autowired
    private AdminMapper adminMapper;

    @PostConstruct
    public void ini(){
        secret=secretKey;
    }
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorization = request.getHeader("Authorization");
        String token = authorization.substring(7);
        System.out.println("jwtinter"+token);
//        是否是控制器方法
        if (!(handler instanceof HandlerMethod)) {
            System.out.println("??");
            return true;
        }
        System.out.println("handle");
        // 执行认证
        if (StrUtil.isBlank(token)) {
            throw new Exception("无token验证失败");
        }
        System.out.println("1");
        // 获取 token 中的 adminId并判断是否存在于数据库
        JWTVerifier jwtVerifier=JWT.require(Algorithm.HMAC256(secret)).withIssuer("Diana").build();
        DecodedJWT decodedJWT=jwtVerifier.verify(token);
        Admin admin = adminMapper.selectById(decodedJWT.getClaim("adminId").asString());
        System.out.println("admin");
        if(admin==null){
            throw new Exception("用户不存在");
        }
        return true;
    }
}
