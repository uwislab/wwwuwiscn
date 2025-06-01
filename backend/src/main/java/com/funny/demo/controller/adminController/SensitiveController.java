package com.funny.demo.controller.adminController;

import com.funny.demo.service.adminService.SensitiveService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/funnyManage/sensitive")
public class SensitiveController {
    @Resource
    private SensitiveService sensitiveService;
    // 获取所有敏感词
    @GetMapping("/getWords")
    public Result getWords() {
        return sensitiveService.getAllWords();
    }
    // 删除敏感词
    @DeleteMapping("/deleteWord")
    public Result deleteWord(@RequestParam Integer sensitiveId){
        return sensitiveService.deleteWord(sensitiveId);
    }
    // 添加敏感词
    @PostMapping("/addWord")
    public Result addWord(@RequestParam String sensitiveWord){
        return sensitiveService.addWord(sensitiveWord);
    }
}
