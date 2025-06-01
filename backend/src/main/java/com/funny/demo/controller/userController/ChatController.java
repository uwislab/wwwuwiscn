package com.funny.demo.controller.userController;

import com.funny.demo.service.userService.ChatService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/funny/user/chat")
public class ChatController {
    @Resource
    private ChatService chatService;
//    处理文本消息
    @GetMapping("")
    public Result handleTextMessage(@RequestParam String userMessage, @RequestParam String conversationId) {
        return chatService.handleTextMessage(userMessage,conversationId);
    }
//    处理语音消息
    @PostMapping("/voiceChat")
    public Result handleVoiceMessage(@RequestBody MultipartFile file,@RequestParam String conversationId,@RequestParam Integer duration) {
        return chatService.handleVoiceMessage(file,conversationId,duration);
    }
//    获取聊天记录
    @GetMapping("/selectChatHistory")
    public Result selectChatHistory(@RequestParam String conversationId) {
        return chatService.getChatMessage(conversationId);
    }
//    删除单条聊天记录
    @PutMapping("/deleteChatHistory")
    public Result deleteOneChatHistory(@RequestParam String messageId) {
        return chatService.deleteChatHistory(messageId);
    }
//    更改AI头像
    @PostMapping("/changeAiImage")
    public Result changeAiImage(@RequestParam String conversationId,@RequestBody MultipartFile file) {
        return chatService.changeAiImage(conversationId,file);
    }
//    更新AI备注
    @PutMapping("/changeAiNotes")
    public Result changeAiNotes(@RequestParam String conversationId,@RequestParam String notes) {
        return chatService.changeAiNotes(conversationId,notes);
    }
//    删除对话
    @PutMapping("/deleteConversation")
    public Result deleteConversation(@RequestParam String conversationId) {
        return chatService.deleteConversation(conversationId);
    }
//    新增对话
    @PostMapping("/addConversation")
    public Result addConversation(@RequestParam String aiName,@RequestParam Integer aiStyle,@RequestParam String aiNotes) {
        return chatService.addConversation(aiName,aiStyle,aiNotes);
    }
//
//    @PutMapping("/deleteAllChatHistory")
//    public Result deleteAllChatHistory(@RequestParam String conversationId) {
//        return chatService.deleteAllChatHistory(conversationId);
//    }

//    删除部分聊天记录
    @PutMapping("deletePartChatHistory")
    public Result deletePartChatHistory(@RequestParam String messageId) {
        return chatService.deletePartChatHistory(messageId);
    }

    @GetMapping("/selectHistoryByKeyWords")
    public Result selectHistoryByKeyWords(@RequestParam String conversationId,@RequestParam String keyWords) {
        return chatService.selectHistoryByKeyWords(conversationId,keyWords);
    }
    @GetMapping("/selectHistoryByDate")
    public Result selectHistoryByDate(@RequestParam String conversationId,@RequestParam String date) {
        return chatService.selectHistoryByDate(conversationId,date);
    }
//    查询所有对话
    @GetMapping("/selectConversations")
    public Result selectConversations() {
        return chatService.selectConversations();
    }
//    获取新的对话机器人名称
    @GetMapping("/getNewConversation")
    public Result getNewConversation() {
        return chatService.getNewConversation();
    }
//    更改对话模式
    @PutMapping("/changeAiStyle")
    public Result changeAiStyle(@RequestParam String conversationId,@RequestParam Integer aiStyle) {
        return chatService.changeAiStyle(conversationId,aiStyle);
    }
//    获取对话展示信息（聊天中机器人头像、备注等）
    @GetMapping("/getConversationShow")
    public Result getConversationShow(@RequestParam String conId) {
        return chatService.getConversationShow(conId);
    }

}
