package com.funny.demo.service.userService.iml;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;
import java.io.File;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.funny.demo.entity.Conversation;
import com.funny.demo.entity.ConversationToShow;
import com.funny.demo.entity.Message;
import com.funny.demo.entity.Picture;
import com.funny.demo.entity.Set;
import com.funny.demo.mapper.adminMapper.PictureMapper;
import com.funny.demo.mapper.adminMapper.SetMapper;
import com.funny.demo.mapper.userMapper.ConversationMapper;
import com.funny.demo.mapper.userMapper.MessageMapper;
import com.funny.demo.mapper.userMapper.UserMapper;
import com.funny.demo.service.userService.ChatService;
import com.funny.demo.tools.*;
import com.github.houbb.sensitive.word.bs.SensitiveWordBs;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatIml implements ChatService {
    @Autowired
    private MyAIService myAIService;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private ConversationMapper conversationMapper;
    @Autowired
    private PictureMapper pictureMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private OSSUtil ossUtil;
    @Autowired
    private TTSService ttsService;
    @Autowired
    private STTService sttService;
    @Autowired
    private SetMapper setMapper;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    private final SensitiveWordBs sensitiveWordBs;
    private static final String C_CODE_PATH = "D:/funny/generated_robot.c";
    private static final String PY_SCRIPT_PATH = "D:/funny/run_with_interpreter.py";

    @Override
    public Result handleTextMessage(String userMessage, String conversationId) {
        try {
//            根据对话风格选择提示词
            int promptId = conversationMapper.getConversationStyle(conversationId);
            String answer = myAIService.processMessage(conversationId,userMessage,promptId);
//            过滤敏感词
            String filterQuestion = sensitiveWordBs.replace(userMessage);
            if(!filterQuestion.equals(userMessage)){
                userMapper.changeUserViolence(jwtTokenProvider.getToken().getUserId());
            }
            int result = saveTextMessage(conversationId, filterQuestion, "User");
            if(result == 0){
                return new Result(false, "存储用户对话失败");
            }
            String filterAnswer = sensitiveWordBs.replace(answer);
            int resultOne = saveTextMessage(conversationId, filterAnswer, "Assistant");
            if(resultOne == 0){
                return new Result(false, "存储机器人对话失败");
            }
            System.out.println("answer:"+answer);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            conversationMapper.changeMessage(sdf.format(new Date()),answer, conversationId);
//            return new Result(true, answer,"获取AI回答成功");
        } catch (Exception e) {
            e.printStackTrace();
//            return new Result(false, "获取AI回答失败");
        }
        return new Result(true, "获取AI回答成功");
    }
    @Override
    public Result handleVoiceMessage(MultipartFile userFile, String conversationId,Integer duration) {
        try {
            File tempFile = File.createTempFile("audio_", ".mp3");
            userFile.transferTo(tempFile);
            System.out.println("tempFile:"+tempFile.getAbsolutePath());
            String userMessage = sttService.recognize(tempFile);

            System.out.println("userMessage:"+userMessage);
            int promptId = conversationMapper.getConversationStyle(conversationId);
            String answer = myAIService.processMessage(conversationId,userMessage,promptId);
            System.out.println("answer:"+answer);
            String voiceUrl = ossUtil.uploadMp3(tempFile);
            int result = saveVoiceMessage(conversationId, userMessage, voiceUrl,"User",duration);
            if(result == 0){
                return new Result(false, "存储用户对话失败");
            }
            String mp3Url = textToVoice(answer);
            int resultOne = saveVoiceMessage(conversationId, answer, mp3Url,"Assistant",null);
            if(resultOne == 0){
                return new Result(false, "存储机器人对话失败");
            }
            System.out.println("answer:"+answer);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            conversationMapper.changeMessage(sdf.format(new Date()),"[语音消息]", conversationId);
            System.out.println("handleVoiceMessage");
            return new Result(true, voiceUrl,"获取AI回答成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "获取AI回答失败");
        }
    }
    public String textToVoice(String text) throws Exception {
        File mp3File = ttsService.tts(text);
        String mp3Url = ossUtil.uploadMp3(mp3File);
        return mp3Url;
    }
    @Override
    public String loadConversationHistory(String conversationId) {
        StringBuilder history = new StringBuilder();
        List<Message> messages = messageMapper.selectList(new QueryWrapper<Message>().eq("message_con_id", conversationId)
                .orderByAsc("message_time")
                .orderByDesc("message_role"));
        if(messages.size()<=40){
            for (Message message : messages) {
                String role = message.getMessageRole();
                String content = message.getMessageContent();
                // 根据角色转换为 Qwen 标签
                String tag = role.equals("user") ? "<|user|>" : "<|assistant|>";
                history.append(tag).append("\n").append(content).append("\n</s>\n");
            }
        }
        else{
            for(int i=0;i<=40;i++){
                Message message = messages.get(i);
                String role = message.getMessageRole();
                String content = message.getMessageContent();
                // 根据角色转换为 Qwen 标签
                String tag = role.equals("user") ? "<|user|>" : "<|assistant|>";
                history.append(tag).append("\n").append(content).append("\n</s>\n");
            }
        }
        String historyStr = history.toString();
        return historyStr;
    }
    @Override
    public Integer saveTextMessage(String conversationId, String content, String role) {
        Message message = new Message();
        message.setMessageId(UUID.randomUUID().toString().replace("-", ""));
        message.setMessageConId(conversationId);
        message.setMessageContent(content);
        message.setMessageRole(role);
        message.setMessageTypeFlag(0);
        int result = messageMapper.insert(message);
        return result;
    }
    @Override
    public Integer saveVoiceMessage(String conversationId, String content, String voiceUrl, String role,Integer duration) {
        Message message = new Message();
        message.setMessageId(UUID.randomUUID().toString().replace("-", ""));
        message.setMessageConId(conversationId);
        message.setMessageContent(content);
        message.setMessageVoiceContent(voiceUrl);
        message.setMessageRole(role);
        message.setMessageTypeFlag(1);
        message.setMessageRecText(content);
        if(duration!=null){
            message.setMessageDuration(duration);
        }
        int result = messageMapper.insert(message);
        return result;
    }
    @Override
    public Result getChatMessage(String conversationId) {
        List<Message> messageList = messageMapper.selectList(new QueryWrapper<Message>()
                .eq("message_con_id", conversationId)
                .eq("message_delete_flag", 0)
                .orderByAsc("message_time")
                .orderByDesc("message_role"));
        return new Result(true, messageList, "获取聊天记录成功");
    }
    @Override
    public Result deleteChatHistory(String messageId) {
        int result = messageMapper.deleteChatHistory(messageId);
        if (result == 0) {
            return new Result(false, "删除聊天记录失败");
        }
        return new Result(true, result, "删除聊天记录成功");
    }
    @Override
    public Result changeAiImage(String conversationId,MultipartFile file) {
        String url = ossUtil.uploadFile(file);
        Picture picture = new Picture();
        picture.setPictureUserId(jwtTokenProvider.getToken().getUserId());
        picture.setPictureType(2);
        picture.setPictureUrl(url);
        picture.setPictureUpBy(0);
        int addResult = pictureMapper.insert(picture);
        if (addResult == 0){
            return new Result(false, "上传图片失败");
        }
        int image = pictureMapper.getIdByUrl(url);
        System.out.println("url:"+url);
        System.out.println("imageId:"+image);
        int result = conversationMapper.changeAiImage(conversationId,image);
        if (result == 0){
            return new Result(false, "修改AI头像失败");
        }
        return new Result(true, url,"修改AI头像成功");
    }
    @Override
    public Result changeAiNotes(String conversationId, String notes){
        int result = conversationMapper.changeAiNotes(conversationId, notes);
        if (result == 0){
            return new Result(false, "修改AI备注失败");
        }
        return new Result(true, result,"修改AI备注成功");
    }
    @Override
    public Result deleteConversation(String conversationId) {
        int result = conversationMapper.deleteConversation(conversationId);
        if (result == 0){
            return new Result(false, "删除会话失败");
        }
        return new Result(true, result,"删除会话成功");
    }
    @Override
    public Result getNewConversation(){
        String userId = JwtTokenProvider.getToken().getUserId();
        int num = conversationMapper.countConversation(userId)+1;
        String conAiName = "Funny"+String.valueOf(num).formatted("%02d");
        return new Result(true,conAiName, "获取新会话配置信息成功");
    }
    @Override
    public Result addConversation(String aiName,Integer aiStyle, String aiNotes) {
        Set set = setMapper.selectById(1);
        Conversation conversation = new Conversation();
        String userId = JwtTokenProvider.getToken().getUserId();
        conversation.setConAiName(aiName);
        conversation.setConId(UUID.randomUUID().toString().replace("-", ""));
        conversation.setConUserId(userId);
        conversation.setConAiStyle(aiStyle);
        conversation.setConAiNotes(aiNotes);
        conversation.setConAiImage(set.getSetRobotImage());
        int result = conversationMapper.insert(conversation);
        if (result == 0){
            return new Result(false, "添加会话失败");
        }
        return new Result(true, result,"添加会话成功");
    }
    @Override
    public Result deleteAllChatHistory(String conversationId) {
        int result = messageMapper.deleteAllChatHistory(conversationId);
        if (result == 0){
            return new Result(false, "删除所有聊天记录失败");
        }
        return new Result(true, result,"删除所有聊天记录成功");
    }
    @Override
    public Result deletePartChatHistory(String messageId) {
        int result = messageMapper.deleteChatHistory(messageId);
        if(result == 0){
            return new Result(false, "删除聊天记录失败");
        }else{
            return new Result(true, result, "删除聊天记录成功");
        }
    }
    @Override
    public Result selectHistoryByKeyWords(String conversationId, String keyWords) {
        List<Message> messageList = messageMapper.selectList(new QueryWrapper<Message>()
                .eq("message_con_id", conversationId)
                .like("message_content", keyWords)
                .eq("message_delete_flag", 0));
        return new Result(true, messageList, "获取聊天记录成功");
    }
    @Override
    public Result selectHistoryByDate(String conversationId, String date) {
        List<Message> messageList = messageMapper.selectList(new QueryWrapper<Message>()
                .eq("message_con_id", conversationId)
                .between("message_create_time", date+" 00:00:00", date+" 23:59:59")
                .eq("message_delete_flag", 0));
        return new Result(true, messageList, "获取聊天记录成功");
    }

    @Override
    public Result selectConversations(){
        String userId = JwtTokenProvider.getToken().getUserId();
        List<ConversationToShow> conversationToShows = new ArrayList<>();
        List<Conversation> conversations = conversationMapper.selectList(new QueryWrapper<Conversation>()
                .eq("con_user_id",userId)
                .eq("con_delete_flag",0));
        System.out.println("conversations:"+conversations);
        for(Conversation conversation : conversations){
            ConversationToShow conversationToShow = new ConversationToShow();
            conversationToShow.setConversation(conversation);
            String url = pictureMapper.getUrlById(conversation.getConAiImage());
            conversationToShow.setConUrl(url);
            conversationToShows.add(conversationToShow);
        }
        int count = conversationMapper.countConversation(userId);
        if(conversationToShows.size()!=count){
            return new Result(false, "获取会话失败");
        }
        return new Result(true, conversationToShows, "获取会话成功");
    }
    @Override
    public Result changeAiStyle(String conversationId, Integer aiStyle) {
        int result = conversationMapper.changeAiStyle(conversationId,aiStyle);
        if(result==0){
            return new Result(false, "修改AI风格失败");
        }
        return new Result(true, result, "修改AI风格成功");
    }
    @Override
    public Result getConversationShow(String conId){
        try{
            Conversation conversation = conversationMapper.selectOne(new QueryWrapper<Conversation>()
                    .eq("con_id", conId));
            ConversationToShow conversationToShow = new ConversationToShow();
            conversationToShow.setConversation(conversation);
            String url = pictureMapper.getUrlById(conversation.getConAiImage());
            conversationToShow.setConUrl(url);
            return new Result(true, conversationToShow, "获取会话成功");
        }catch (Exception e) {
            return new Result(false, "获取会话失败");
        }
    }
}
