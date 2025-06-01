package com.funny.demo.service.adminService.iml;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.funny.demo.entity.Conversation;
import com.funny.demo.entity.Message;
import com.funny.demo.mapper.userMapper.ConversationMapper;
import com.funny.demo.mapper.userMapper.MessageMapper;
import com.funny.demo.service.adminService.ConversationManageService;
import com.funny.demo.tools.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ConversationManageIml implements ConversationManageService {
    @Autowired
    private ConversationMapper conversationMapper;
    @Autowired
    private MessageMapper messageMapper;
    @Override
    public Result getAllConversation(Integer currentPage, Integer pageSize) {
        if (currentPage == null || currentPage <= 0) {
            return new Result(false, null, "当前页码无效");
        }
        try {
            // 创建分页对象
            Page<Conversation> page = new Page<>(currentPage, pageSize);

            // 使用分页查询
            Page<Conversation> result = conversationMapper.selectPage(page,null);
            // 返回结果
            return new Result(true, result, "获取对话列表成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, null, "获取对话列表失败：" + e.getMessage());
        }
    }
    @Override
    public Result getConversationDetail(String conversationId) {
        List<Message> messageList = messageMapper.selectList(new QueryWrapper<Message>()
                .eq("message_con_id", conversationId)
                .orderByAsc("message_time")
                .orderByDesc("message_role"));
        return new Result(true, messageList, "获取聊天记录成功");
    }
    @Override
    public Result deleteConversation() {
        try{
            int result = conversationMapper.delete(new QueryWrapper<Conversation>()
                    .eq("con_delete_flag",1));
        }catch (Exception e){
            return new Result(false, "删除对话失败");
        }
        return new Result(true, "删除对话成功");
    }
}
