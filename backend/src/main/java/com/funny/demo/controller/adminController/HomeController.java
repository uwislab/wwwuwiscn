package com.funny.demo.controller.adminController;

import com.funny.demo.service.adminService.HomeService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funnyManage/home")
public class HomeController {
    @Resource
    private HomeService homeService;
    //获取首页数据
    @GetMapping("/getCount")
    public Result getCount(){
        return homeService.getCount();
    }
}
