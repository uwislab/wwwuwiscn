package com.funny.demo.service.adminService;

import com.funny.demo.tools.Result;

public interface ConversationManageService {

    Result getAllConversation(Integer currentPage, Integer pageSize);

    Result getConversationDetail(String conversationId);

    Result deleteConversation();
}
