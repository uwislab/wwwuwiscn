package com.funny.demo.service.userService;

import com.funny.demo.tools.Result;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface ChatService {
    Result handleTextMessage(String userMessage, String conversationId);
    Result handleVoiceMessage(MultipartFile file, String conversationId,Integer duration);
    String loadConversationHistory(String conversationId);
    Integer saveTextMessage(String conversationId, String content, String role);
    Integer saveVoiceMessage(String conversationId, String content, String voiceContent, String role, Integer duration);
    Result getChatMessage(String conversationId);
    Result deleteChatHistory(String messageId);
    Result changeAiImage(String conversationId, MultipartFile file);
    Result changeAiNotes(String conversationId, String notes);
    Result deleteConversation(String conversationId);
    Result addConversation(String aiName,Integer aiStyle, String aiNotes);
    Result deleteAllChatHistory(String conversationId);
    Result deletePartChatHistory(String messageId);
    Result selectHistoryByKeyWords(String conversationId, String keyWords);
    Result selectHistoryByDate(String conversationId, String date);
    Result selectConversations();
    Result getNewConversation();
    Result changeAiStyle(String conversationId, Integer aiStyle);

    Result getConversationShow(String conId);
}
