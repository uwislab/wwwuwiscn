package com.funny.demo.service.userService.iml;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.funny.demo.entity.*;
import com.funny.demo.entity.Set;
import com.funny.demo.mapper.adminMapper.PictureMapper;
import com.funny.demo.mapper.adminMapper.SetMapper;
import com.funny.demo.mapper.userMapper.UserMapper;
import com.funny.demo.service.userService.UserService;
import com.funny.demo.tools.*;
import com.google.gson.JsonObject;
import org.apache.commons.io.IOUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.security.Security;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class UserIml implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private OSSUtil ossUtil;
    @Autowired
    private PictureMapper pictureMapper;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private SetMapper setMapper;
    @Value("${wechat.appid}")
    private String appId;
    @Value("${wechat.secret}")
    private String secret;
    @Value("${picture.url}")
    private String saveUrl;
    @Override
    public Result changeUserName(String userName) {
        User user = jwtTokenProvider.getToken();
        String userId = user.getUserId();
        Boolean result = userMapper.changeUserName(userName,userId);
        if (result){
            return new Result(true,"修改名称成功");
        }
        return new Result(false,"修改名称失败");
    }
    @Override
    public Result changeUserImage(MultipartFile file) {
        String path = addUserImage(file);
        int userImage = pictureMapper.getIdByUrl(path);
        User user = jwtTokenProvider.getToken();
        String userId = user.getUserId();
        Boolean result = userMapper.changeUserImage(userImage,userId);
        if (result){
            return new Result(true,"修改头像成功");
        }
        return new Result(false,"修改头像失败");
    }
    public String addUserImage(MultipartFile file) {
        String url = ossUtil.uploadFile(file);
        Picture picture = new Picture();
        picture.setPictureUserId(jwtTokenProvider.getToken().getUserId());
        picture.setPictureType(0);
        picture.setPictureUrl(url);
        picture.setPictureUpBy(0);
        int result = pictureMapper.insert(picture);
        if (result==0){
            throw new RuntimeException("上传图片失败");
        }
        return url;
    }
    @Override
    public Result changeUserBack(Integer userBack) {
        User user = jwtTokenProvider.getToken();
        String userId = user.getUserId();
        Boolean result = userMapper.changeUserBack(userBack,userId);
        if (result){
            return new Result(true,"修改聊天背景成功");
        }
        return new Result(false,"修改聊天背景失败");
    }
    @Override
    public Result addUserBack(MultipartFile file){
        String url = ossUtil.uploadFile(file);
        Picture picture = new Picture();
        picture.setPictureUserId(jwtTokenProvider.getToken().getUserId());
        picture.setPictureType(1);
        picture.setPictureUrl(url);
        picture.setPictureUpBy(0);
        int result = pictureMapper.insert(picture);
        if (result==0){
            throw new RuntimeException("上传图片失败");
        }
        return new Result(true,"上传图片成功");
    }
    @Override
    public Result changeUserSignature(String userSignature) {
        User user = jwtTokenProvider.getToken();
        String userId = user.getUserId();
        Boolean result = userMapper.changeUserSignature(userSignature,userId);
        if (result){
            return new Result(true,"修改个性签名成功");
        }
        return new Result(false,"修改个性签名失败");
    }
    @Override
    public Result changeUserSex(Integer userSex) {
        User user = jwtTokenProvider.getToken();
        String userId = user.getUserId();
        Boolean result = userMapper.changeUserSex(userSex,userId);
        if (result){
            return new Result(true,"修改性别成功");
        }
        return new Result(false,"修改性别失败");
    }
    public UserWithPictureUrl getUserInfo(String userId) {
        User userInfo = userMapper.selectById(userId);
        UserWithPictureUrl result =new UserWithPictureUrl();
        result.setUser(userInfo);
        result.setPictureUrl(pictureMapper.getUrlById(userInfo.getUserImage()));
        if (result != null){
            return result;
        }
        return null;
    }
    @Override
    public Result deleteUser() {
        String userId = jwtTokenProvider.getToken().getUserId();
        int result = userMapper.deleteById(userId);
        if (result==0){
            return new Result(true,"删除用户失败");
        }
        return new Result(false,"删除用户成功");
    }

    @Override
    public Result login(@RequestBody LoginRequest request){
        try {
            System.out.println("start");
            // 1. 获取openid
            WechatSession wechatSession = getWechatSession(request.getCode());
            System.out.println("1");
            String openid = wechatSession.getOpenId();
            System.out.println("2");
            String sessionKey = wechatSession.getSessionKey();
            System.out.println("openid:"+openid);
            // 2. 解密用户数据
            UserWithPictureUrl userWithPictureUrl = decryptUserInfo(
                    request.getEncryptedData(),
                    request.getIv(),
                    sessionKey,
                    openid
            );
            System.out.println("user");
            // 3. 创建/更新用户
            User user = userMapper.selectById(openid);
            if(user == null){
                User userInfo = userWithPictureUrl.getUser();
                System.out.println(userInfo);
                int result = userMapper.insert(userInfo);
                System.out.println("bbbbbbbbb");
                if (result==0){
                    return new Result(false,"创建用户失败");
                }
            }
            System.out.println("4444444444");
            // 4. 生成JWT
            String token = jwtTokenProvider.createToken(openid);
            System.out.println("555555555555");
            LoginBack loginBack = new LoginBack();
            loginBack.setToken(token);
            UserWithPictureUrl userToBack = getUserInfo(openid);
            loginBack.setUserInfo(userToBack.getUser());
            loginBack.setPictureUrl(userToBack.getPictureUrl());
            loginBack.setBackUrl(pictureMapper.getUrlById(userToBack.getUser().getUserBack()));
            if(loginBack.getUserInfo().getUserStatus()==1){
                return new Result(false,loginBack,"用户已被冻结");
            }
            if(loginBack.getUserInfo().getUserViolation()==2){
                return new Result(false,loginBack,"解封申请待处理");
            }
            return new Result(true,loginBack,"登录成功");

        } catch (Exception e) {
            return new Result(false,"登录失败");
        }
    }
    private WechatSession getWechatSession(String code) throws Exception {
        String url = "https://api.weixin.qq.com/sns/jscode2session";//指定URL
        Map<String, Object> map = new HashMap<>();//存放参数
        map.put("appid", appId);
        map.put("secret", secret);
        map.put("js_code",code);
        map.put("grant_type","authorization_code");
        System.out.println("map:"+map);
        //发送get请求并接收响应数据
        String result = HttpRequest.get(url)
                .form(map)
                .execute() // 执行请求
                .body();   // 获取响应体
        System.out.println("result:" + result);
        System.out.println("aaaaa");
        String openId = JSONUtil.parseObj(result).get("openid").toString();
        String sessionKey = JSONUtil.parseObj(result).get("session_key").toString();
        System.out.println("openId:"+openId);
        WechatSession wechatSession = new WechatSession();
        wechatSession.setOpenId(openId);
        wechatSession.setSessionKey(sessionKey);
        return wechatSession;
    }
    private UserWithPictureUrl decryptUserInfo(String encryptedData, String iv, String sessionKey,String openId) throws Exception {
        try {
            // 添加BouncyCastle提供者以支持PKCS7Padding
            Security.addProvider(new BouncyCastleProvider());
            System.out.println("qqqqqq");
            // Base64解码参数
            byte[] sessionKeyBytes = Base64.getDecoder().decode(sessionKey);
            byte[] ivBytes = Base64.getDecoder().decode(iv);
            byte[] encryptedDataBytes = Base64.getDecoder().decode(encryptedData);
            System.out.println("wwwwww");
            // 初始化AES解密器
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding", "BC");
            SecretKeySpec keySpec = new SecretKeySpec(sessionKeyBytes, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            System.out.println("eeeeee");
            // 执行解密
            byte[] decryptedBytes = cipher.doFinal(encryptedDataBytes);
            System.out.println("decryptedBytes:"+decryptedBytes);
            String decryptedJson = new String(decryptedBytes, StandardCharsets.UTF_8);
            System.out.println("rrrrrr");
            // 解析JSON数据
            JSONObject json = new JSONObject(decryptedJson);
            System.out.println("ttttttttt");
            // 验证数据水印
            JSONObject watermark = json.getJSONObject("watermark");
            if (!watermark.get("appid").equals(appId)) {
                throw new SecurityException("数据来源不合法");
            }
//            String avatarUrl = savePictureToLocal(json.get("avatarUrl").toString());
            // 构建用户信息对象
            User userInfo = new User();
            userInfo.setUserId(openId);
            userInfo.setUserName(json.get("nickName").toString());
            userInfo.setUserSex(json.getInt("gender")); // 微信性别: 0-未知 1-男 2-女
            Set set = setMapper.selectById(1);
            userInfo.setUserImage(set.getSetUserImage());
            userInfo.setUserBack(set.getSetBack());
            UserWithPictureUrl userWithPictureUrl = new UserWithPictureUrl();
            userWithPictureUrl.setUser(userInfo);
            userWithPictureUrl.setPictureUrl(pictureMapper.getUrlById(set.getSetUserImage()));
            return userWithPictureUrl;
        } catch (Exception e) {
            throw new Exception("用户信息解密失败: " + e.getMessage());
        }
    }
    @Override
    public Result getUserInfo() {
        String userId = jwtTokenProvider.getToken().getUserId();
        User userInfo = userMapper.selectById(userId);
        UserWithPictureUrl result =new UserWithPictureUrl();
        result.setUser(userInfo);
        result.setPictureUrl(pictureMapper.getUrlById(userInfo.getUserImage()));
        if (result != null){
            return new Result(true,result,"查询用户信息成功");
        }
        return new Result(false,"查询用户信息失败");
    }
    @Override
    public Result selectBackPicture() {
        String userId = jwtTokenProvider.getToken().getUserId();
        List<Picture> pictures = pictureMapper.selectList(new QueryWrapper<Picture>()
                .eq("picture_type", 1)
                .eq("picture_up_by",1));
        List<Picture> UserPictures = pictureMapper.selectList(new QueryWrapper<Picture>()
                .eq("picture_type", 1)
                .eq("picture_user_id",userId));
        for(Picture picture:UserPictures){
            pictures.add(picture);
        }
        if (pictures != null){
            return new Result(true,pictures,"查询背景图片成功");
        }
        return new Result(false,"查询背景图片失败");
    }
    @Override
    public Result deleteUserBack(Integer userBack){
        Integer result = pictureMapper.deleteById(userBack);
        if (result == 0){
            return new Result(false,"删除背景图片失败");
        }
        return new Result(true,"删除背景图片成功");
    }
    @Override
    public Result applyUnfrozen() {
        String userId = jwtTokenProvider.getToken().getUserId();
        System.out.println("userId:"+userId);
        int result = userMapper.applyUnfrozen(userId);
        if(result==0){
            return new Result(false,"申请解冻异常");
        }
        return new Result(true,"申请解冻成功");
    }
}
