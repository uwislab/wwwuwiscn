package com.funny.demo.mapper.userMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.Conversation;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ConversationMapper extends BaseMapper<Conversation> {
    public int countConversation(String userId);
    public int getConversationStyle(String conversationId);
    public int changeMessage(String date,String answer,String conversationId);
    public int changeAiImage(String conversationId,Integer image);
    public int changeAiNotes(String conversationId,String notes);
    public int deleteConversation(String conversationId);
    public int changeAiStyle(String conversationId, Integer aiStyle);

    void updateRobotImage(Integer pictureId, Integer setRobotImage);
}
