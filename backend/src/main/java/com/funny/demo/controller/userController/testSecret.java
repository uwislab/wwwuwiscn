package com.funny.demo.controller.userController;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.funny.demo.tools.*;
import com.github.houbb.sensitive.word.bs.SensitiveWordBs;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.output.Response; // 添加对Response类的导入
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class testSecret { // 修改类名为符合命名规范的TestSecretController

    @Autowired
    private MyAIService myAIService;
    private final SensitiveWordBs sensitiveWordBs;
    @Autowired
    private TTSService ttsService;
    @Autowired
    private STTService sttService;
    @Autowired
    private OSSUtil ossUtil;
    private final OpenAiChatModel openAiModel;
    private final ContentRetriever retriever;
    @Autowired
    private RedisFullQueryHelper redisFullQueryHelper;

    @GetMapping("")
    public String test(){
        return sensitiveWordBs.replace("你怎么不去死啊！");
    }
    @GetMapping("/testR")
    public String testR() {
        String message = "左转";
        String answer = myAIService.testRAG(message);
        return answer;
    }
    @PostMapping("/tts")
    public String tts() throws Exception {
        File file  = ttsService.tts("你好");
        System.out.println("tempFile:"+file.getAbsolutePath());
        String path = ossUtil.uploadMp3(file);
        return path;
    }
    @PostMapping("/stt")
    public String stt() throws Exception {
        File file = new File("D:\\funny\\MP3\\47954c31-660a-40f2-95a1-1e51cd883b28.mp3");
        try{
            String text = sttService.recognize(file);
            System.out.println("调用 recognize 函数返回的结果: " + text);
            return text;
        }catch (Exception e){
            e.printStackTrace();
            return "error";
        }
    }
    @GetMapping("/rag")
    public String rag(){
        List<Content> retrievedDocs = retriever.retrieve(Query.from("控制机器人后退"));
        System.out.println("retrievedDocs:"+retrievedDocs);
        return retrievedDocs.toString();
    }
    @GetMapping("/testjudge")
    public String testJudge(){
        String userMessage = "左转";
        String answer = myAIService.testJudge(userMessage);
        System.out.println("answer:"+answer);
        return answer;
    }
    @GetMapping("/knowledge")
    public Result Knowledge(){
        List<String> result= redisFullQueryHelper.getAllTextByKeyPattern();
        return new Result(true, result, "查询成功");
    }
}
