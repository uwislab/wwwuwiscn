package com.funny.demo.controller.adminController;

import com.funny.demo.service.adminService.KnowledgeBaseService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/funnyManage/knowledge")
public class KnowledgeBaseController {
    @Resource
    private KnowledgeBaseService knowledgeBaseService;
    //上传文件到知识库
    @PutMapping("/blankRow")
    public Result addKnowledge(@RequestBody MultipartFile file)
    {
        return knowledgeBaseService.addKnowledge(file);
    }
    //获得知识库内容
    @GetMapping("/getKnowledge")
    public Result getKnowledge()
    {
        return knowledgeBaseService.getKnowledge();
    }
}
