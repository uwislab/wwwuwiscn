package com.funny.demo.tools;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.funny.demo.entity.Admin;
import com.funny.demo.entity.User;
import com.funny.demo.mapper.adminMapper.AdminMapper;
import com.funny.demo.mapper.userMapper.UserMapper;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
@Slf4j
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long validityInMilliseconds;
    @Autowired
    private UserMapper userMapperToUse;
    @Autowired
    private AdminMapper adminMapperToUse;

    private static String secret;
    private static long expiration;
    private static UserMapper userMapper;
    private static AdminMapper adminMapper;
    @PostConstruct
    public void ini(){
        secret=secretKey;
        expiration=validityInMilliseconds;
        userMapper=userMapperToUse;
        adminMapper=adminMapperToUse;
    }

    public static String createToken(String userId) {
        String token=null;
        try {
            System.out.println("getDate");
            Date expireAt=new Date(System.currentTimeMillis()+expiration);
            System.out.println("secret");
            token = JWT.create()
                    //发行人
                    .withIssuer("Diana")
                    //存放数据
                    .withClaim("openId",userId)
                    //过期时间
                    .withExpiresAt(expireAt)
                    .sign(Algorithm.HMAC256(secret));
            System.out.println("createtoken:"+token);
        } catch (IllegalArgumentException | JWTCreationException je) {
            je.printStackTrace();
        }
        return token;
    }

    public static String createAdiminToken(String adminId) {
        String token=null;
        try {
            System.out.println("getDate");
            Date expireAt=new Date(System.currentTimeMillis()+expiration);
            System.out.println("secret");
            token = JWT.create()
                    //发行人
                    .withIssuer("Diana")
                    //存放数据
                    .withClaim("adminId",adminId)
                    //过期时间
                    .withExpiresAt(expireAt)
                    .sign(Algorithm.HMAC256(secret));
            System.out.println("createtoken:"+token);
        } catch (IllegalArgumentException | JWTCreationException je) {
            je.printStackTrace();
        }
        return token;
    }

    //解密token并判断用户是否存在
    public static User verify(String token){
        try {
            //创建token验证器
            JWTVerifier jwtVerifier=JWT.require(Algorithm.HMAC256(secret)).withIssuer("Diana").build();
            DecodedJWT decodedJWT=jwtVerifier.verify(token);
            User user = userMapper.selectById(decodedJWT.getClaim("openId").asString());
            return user!=null?user:new User();
//            System.out.println("过期时间：      " + decodedJWT.getExpiresAt());

        } catch (IllegalArgumentException | JWTVerificationException e) {
            //抛出错误即为验证不通过
//            throw new IllegalArgumentException("未获取到用户信息！请登录！");
            return new User();
        }
    }

    public static Admin adminVerify(String token){
        try {
            //创建token验证器
            JWTVerifier jwtVerifier=JWT.require(Algorithm.HMAC256(secret)).withIssuer("Diana").build();
            DecodedJWT decodedJWT=jwtVerifier.verify(token);
            Admin admin = adminMapper.selectById(decodedJWT.getClaim("adminId").asString());
            return admin!=null?admin:new Admin();
//            System.out.println("过期时间：      " + decodedJWT.getExpiresAt());

        } catch (IllegalArgumentException | JWTVerificationException e) {
            //抛出错误即为验证不通过
//            throw new IllegalArgumentException("未获取到用户信息！请登录！");
            return new Admin();
        }
    }




    //    解密token并获取token用户信息
    public static User getToken(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        System.out.println(request);
        String token = request.getHeader("token");
        System.out.println("token:"+token);
        User user = verify(token);
        if(user != null){
            return user;
        }
        else{
            log.error("***token无效***");
            return new User();
        }
    }

    public static Admin getAdminToken(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        System.out.println(request);
        String authorization = request.getHeader("Authorization");
        String token = authorization.substring(7);
        System.out.println("authorization:"+authorization);
        System.out.println("token:"+token);
        Admin admin=adminVerify(token);
        if(admin!=null){
            return admin;
        }
        else{
            log.error("***token无效***");
            return new Admin();
        }
    }
}
