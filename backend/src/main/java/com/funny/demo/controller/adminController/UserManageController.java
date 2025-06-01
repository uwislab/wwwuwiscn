package com.funny.demo.controller.adminController;

import com.funny.demo.entity.SelectUser;
import com.funny.demo.service.adminService.UserManageService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/funnyManage/userManage")
public class UserManageController {
    @Resource
    private UserManageService userManageService;
//    获取所有用户信息
    @GetMapping("/getUser")
    public Result getAllUser(@RequestParam Integer currentPage, @RequestParam Integer pageSize){
        return userManageService.getAllUser(currentPage,pageSize);
    }
//    根据条件选择用户
    @PostMapping("/selectUser")
    public Result selectUser(@RequestBody SelectUser selectUser){
        return userManageService.selectUser(selectUser);
    }
//    获取用户头像
    @GetMapping("/getUserAvatar")
    public Result getUserAvatar(@RequestParam Integer pictureId){
        return userManageService.getUserAvatar(pictureId);
    }
//    冻结单个用户账号
    @PutMapping("/frozenUser")
    public Result frozenUser(@RequestParam String userId){
        return userManageService.frozenUser(userId);
    }
//    批量冻结用户账号
    @PutMapping("/frozenUsers")
    public Result frozenUsers(){
        return userManageService.frozenUsers();
    }
//    解冻用户账号
    @PutMapping("unfrozenUser")
    public Result unfrozenUser(@RequestParam String userId){
        return userManageService.unfrozenUser(userId);
    }
//    批量解冻用户账号
    @PutMapping("unfrozenUsers")
    public Result unfrozenUsers(){
        return userManageService.unfrozenUsers();
    }
}
