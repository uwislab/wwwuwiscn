package com.funny.demo.controller.adminController;

import com.funny.demo.service.adminService.ConversationManageService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/funnyManage/conversation")
public class ConversationManageController {
    @Resource
    private ConversationManageService conversationManageService;
    //获取所有对话
    @GetMapping("/getAllConversation")
    public Result getAllConversation(@RequestParam Integer currentPage, @RequestParam Integer pageSize) {
        return conversationManageService.getAllConversation(currentPage, pageSize);
    }
    //获取对话详细信息
    @GetMapping("/getConversationDetail")
    public Result getConversationDetail(@RequestParam String conversationId) {
        return conversationManageService.getConversationDetail(conversationId);
    }
    //删除对话
    @DeleteMapping("/deleteConversation")
    public Result deleteConversation() {
        return conversationManageService.deleteConversation();
    }

}
