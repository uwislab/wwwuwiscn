package com.funny.demo.mapper.userMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.Message;
import org.springframework.stereotype.Repository;
import org.apache.ibatis.annotations.Mapper;
@Mapper
@Repository
public interface MessageMapper extends BaseMapper<Message> {
    public int deleteChatHistory(String messageId);
    public int deleteAllChatHistory(String conversationId);
//    public int addConversation(String userId,Integer aiStyle,String aiNotes,Byte[] aiImage);
}
