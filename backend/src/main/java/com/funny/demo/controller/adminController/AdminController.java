package com.funny.demo.controller.adminController;

import com.funny.demo.service.adminService.AdminService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/funnyManage/admin")
public class AdminController {
    @Resource
    private AdminService adminService;
    // 管理员登录接口
    @PostMapping("/login")
    public Result login(@RequestParam String adminId,@RequestParam String adminPassword) {
        return adminService.login(adminId,adminPassword);
    }
    // 添加管理员接口
    @PostMapping("/addAdmin")
    public Result addAdmin(@RequestParam String adminName) {
        return adminService.addAdmin(adminName);
    }
    // 删除管理员接口
    @DeleteMapping("/deleteAdmin")
    public Result deleteAdmin(@RequestParam String adminId) {
        return adminService.deleteAdmin(adminId);
    }
    // 修改管理员密码接口
    @PutMapping("/changeAdminPassword")
    public Result changeAdminPassword(@RequestParam String adminPassword) {
        return adminService.changeAdminPassword(adminPassword);
    }
    // 修改管理员信息接口
    @PutMapping("/changeAdmin")
    public Result changeAdmin(@RequestParam String adminEmail,@RequestParam String adminPhone) {
        return adminService.changeAdmin(adminEmail,adminPhone);
    }
    // 获取所有管理员信息接口
    @GetMapping("/getAllAdmin")
    public Result getAllAdmin(@RequestParam Integer currentPage, @RequestParam Integer pageSize) {
        return adminService.getAllAdmin(currentPage,pageSize);
    }
    // 修改管理员头像接口
    @PutMapping("/changeAdminImage")
    public Result changeAdminImage(@RequestBody MultipartFile file) {
        System.out.println("changeStart");
        return adminService.changeAdminImage(file);
    }
    // 查询管理员接口
    @GetMapping("/selectAdmin")
    public Result selectAdmin(@RequestParam String adminName,@RequestParam Integer currentPage, @RequestParam Integer pageSize) {
        return adminService.selectAdmin(adminName,currentPage,pageSize);
    }
}
