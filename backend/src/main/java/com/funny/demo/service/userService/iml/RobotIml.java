package com.funny.demo.service.userService.iml;

import com.funny.demo.config.RobotConfig;
import com.funny.demo.entity.ForRobot;
import com.funny.demo.entity.Message;
import com.funny.demo.mapper.userMapper.ConversationMapper;
import com.funny.demo.mapper.userMapper.MessageMapper;
import com.funny.demo.mapper.userMapper.UserMapper;
import com.funny.demo.service.userService.RobotService;
import com.funny.demo.tools.*;
import com.github.houbb.sensitive.word.bs.SensitiveWordBs;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class RobotIml implements RobotService {
    @Autowired
    private MyAIService myAIService;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private ConversationMapper conversationMapper;
    @Autowired
    private RobotConfig robotConfig;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private STTService sttService;
    @Autowired
    private TTSService ttsService;
    @Autowired
    private OSSUtil ossUtil;

    private final SensitiveWordBs sensitiveWordBs;
    private static final Logger logger = LoggerFactory.getLogger(RobotIml.class);

    public String executeCommand(String command) {

        // Base64编码处理
        String encodedCmd = Base64.getEncoder().encodeToString(command.getBytes());

        // 构造CURL命令
        String curlCommand = String.format(
                "%s?cmd=%s&id=%s",
                robotConfig.getApiUrl(), encodedCmd,jwtTokenProvider.getToken().getUserId());
        return curlCommand;
    }
    public void useRequest(String command){
        System.out.println(command);
        try {
            // 执行 GET 请求
            ResponseEntity<String> response = restTemplate.getForEntity(command, String.class);

            // 记录日志
            logger.info("请求成功 | 请求地址:{} | 响应状态码:{}",
                    command, response.getStatusCode());
        } catch (Exception e) {
            // 捕获 RestTemplate 相关异常
            logger.error("请求失败 | 请求地址:{} | 异常信息:{}", command, e.getMessage(), e);
            throw new RuntimeException("请求失败，请检查服务器状态", e);
        }
    }
    @Override
    public Result controlRobotByText(String userMessage, String conversationId){
        try {
            ForRobot forRobot = myAIService.controlRobotByText(userMessage, conversationId);
            String answer = forRobot.getAnswer();
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
            if(forRobot.getJudge() == 1){
                useRequest(executeCommand(answer));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "获取AI回答失败");
        }
        return new Result(true, "获取AI回答成功");
    }
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
    public Result controlRobotByVoice(MultipartFile userFile, String conversationId,Integer duration){
        try {
            File tempFile = File.createTempFile("audio_", ".mp3");
            userFile.transferTo(tempFile);
            System.out.println("tempFile:"+tempFile.getAbsolutePath());
            String userMessage = sttService.recognize(tempFile);
            ForRobot forRobot = myAIService.controlRobotByText(userMessage, conversationId);
            String answer = forRobot.getAnswer();
            String voiceUrl = ossUtil.uploadMp3(tempFile);
            int result = saveVoiceMessage(conversationId, userMessage, voiceUrl,"User",duration);
            if(result == 0){
                return new Result(false, "存储用户对话失败");
            }
            String filterAnswer = sensitiveWordBs.replace(answer);
            int resultOne = saveTextMessage(conversationId, filterAnswer, "Assistant");
            if(resultOne == 0){
                return new Result(false, "存储机器人对话失败");
            }
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            conversationMapper.changeMessage(sdf.format(new Date()),filterAnswer, conversationId);
            if(forRobot.getJudge() == 1){
                useRequest(executeCommand(answer));
            }
            return new Result(true, voiceUrl,"获取AI回答成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "获取AI回答失败");
        }
    }
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
    public String textToVoice(String text) throws Exception {
        File mp3File = ttsService.tts(text);
        String mp3Url = ossUtil.uploadMp3(mp3File);
        return mp3Url;
    }

}
