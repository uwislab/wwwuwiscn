package com.funny.demo.controller.userController;

import com.funny.demo.entity.LoginRequest;
import com.funny.demo.service.userService.UserService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/funny/user")
public class UserController {
    @Resource
    private UserService userService;
//  用户登录
    @PostMapping("/login")
    public Result login(@RequestBody LoginRequest request){
        return userService.login(request);
    }
//    修改用户名称
    @PutMapping("/changeUserName")
    public Result changeUserName(@RequestParam String userName){
        return userService.changeUserName(userName);
    }
//    修改用户头像
    @PostMapping("/changeUserImage")
    public Result changeUserImage(@RequestParam MultipartFile multipartfile){
        return userService.changeUserImage(multipartfile);
    }
//    添加用户背景图
    @PostMapping("/addUserBack")
    public Result addUserBack(@RequestBody MultipartFile multipartfile){
        return userService.addUserBack(multipartfile);
    }
//    修改用户背景图
    @PutMapping("/changeUserBack")
    public Result changeUserBack(@RequestParam Integer userBack){

        return userService.changeUserBack(userBack);
    }
//    修改用户签名
    @PutMapping("/changeUserSignature")
    public Result changeUserSignature(@RequestParam String userSignature){
        return userService.changeUserSignature(userSignature);
    }
//    修改用户性别
    @PutMapping("/changeUserSex")
    public Result changeUserSex(@RequestParam Integer userSex){
        return userService.changeUserSex(userSex);
    }
//    获取用户信息
    @GetMapping("/getUserInfo")
    public Result getUserInfo(){
        return userService.getUserInfo();
    }
//    注销账号
    @PutMapping("/deleteUser")
    public Result deleteUser(){
        return userService.deleteUser();
    }
//    获取背景图片
    @GetMapping("/selectBackPicture")
    public Result selectBackPicture(){
        return userService.selectBackPicture();
    }
//    删除用户背景图
    @DeleteMapping("/deleteUserBack")
    public Result deleteUserBack(@RequestParam Integer userBack){
        return userService.deleteUserBack(userBack);
    }
//    申请解封账号
    @PutMapping("/applyUnfrozen")
    public Result applyUnfrozen(){
        return userService.applyUnfrozen();
    }
}
