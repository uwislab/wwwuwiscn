package com.funny.demo.tools;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.funny.demo.entity.ForRobot;
import com.funny.demo.entity.Message;
import com.funny.demo.mapper.userMapper.MessageMapper;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MyAIService {
    @Autowired
    private MessageMapper messageMapper;
    private final OllamaChatModel ollamaModel;
    private final OpenAiChatModel openAiModel;
    private final ContentRetriever retriever;
    public String processMessage(String conversationId, String userInput,Integer promptId) {
        try {
            // 1. 检索相关文档
            List<Content> retrievedDocs = retriever.retrieve(Query.from(userInput));
            List<String> textContents = new ArrayList<>();
            for (Content content : retrievedDocs) {
                TextSegment textSegment = content.textSegment();
                textContents.add(textSegment.text());
            }
            // 2. 加载对话历史（最多40条）
            String rawHistory = loadConversationHistory(conversationId);

            // 3. 构建最终Prompt
            String finalPrompt = Prompts.getPrompt(userInput, textContents, rawHistory, promptId);
            System.out.println("finalPrompt:"+finalPrompt);
            String answer = "";
            if(promptId==3){
                ChatLanguageModel model = openAiModel;
                answer = model.generate(finalPrompt);
            }else{
                ChatLanguageModel model = ollamaModel;
                answer = model.generate(finalPrompt);
            }
            return answer;
        } catch (Exception e) {
            return "服务暂时不可用，请稍后再试";
        }
    }
    public String testRAG(String message){
        try {
            String prompt = "控制机器人"+message;
            // 1. 检索相关文档
            List<Content> retrievedDocs = retriever.retrieve(Query.from(prompt));
            List<String> textContents = new ArrayList<>();
            for (Content content : retrievedDocs) {
                TextSegment textSegment = content.textSegment();
                textContents.add(textSegment.text());
            }
            System.out.println("content:"+textContents);
//            // 2. 加载对话历史（最多40条）
//            String rawHistory = loadConversationHistory(conversationId);

            // 3. 构建最终Prompt
            String finalPrompt = Prompts.testPrompt(message, textContents);
            System.out.println("finalPrompt:"+finalPrompt);
            ChatLanguageModel model = openAiModel;
            // 4. 调用模型生成回答
            String answer = model.generate(finalPrompt);

            return answer;
        } catch (Exception e) {
            return "服务暂时不可用，请稍后再试";
        }
    }
    public ForRobot controlRobotByText(String userMessage, String conversationId) {
        try {
            ForRobot forRobot = new ForRobot();
            ChatLanguageModel model = openAiModel;
            String prompt = "";
            String answer = "";
            // 2. 加载对话历史（最多40条）
            String rawHistory = loadConversationHistory(conversationId);
            String judgePrompt = Prompts.judgePrompt(userMessage,rawHistory);
            String judgeString = model.generate(judgePrompt);
            System.out.println("judgeString:"+judgeString);
            if(judgeString.equals("发送命令")){
                forRobot.setJudge(1);
                prompt="控制机器人"+userMessage;
            }else{
                forRobot.setJudge(0);
                forRobot.setAnswer(judgeString);
                return forRobot;
            }
            // 1. 检索相关文档
            List<Content> retrievedDocs = retriever.retrieve(Query.from(prompt));
            List<String> textContents = new ArrayList<>();
            for (Content content : retrievedDocs) {
                TextSegment textSegment = content.textSegment();
                textContents.add(textSegment.text());
            }
            System.out.println("content:"+textContents);
            // 3. 构建最终Prompt
            String finalPrompt = Prompts.testPrompt(userMessage, textContents);
            System.out.println("finalPrompt:"+finalPrompt);
            // 4. 调用模型生成回答
            answer = model.generate(finalPrompt);
            forRobot.setAnswer(answer);
            return forRobot;
        } catch (Exception e) {
            return null;
        }
    }
    public String testJudge(String message){
        ChatLanguageModel model = openAiModel;
        // 2. 加载对话历史（最多40条）
        String rawHistory = "";
        String judgePrompt = Prompts.judgePrompt(message,rawHistory);
        String judgeString = model.generate(judgePrompt);
        System.out.println("judgeString:"+judgeString);
        return judgeString;
    }
    public String testControlRobotByText(String userMessage) {
        try {
            ChatLanguageModel model = openAiModel;
            String prompt = "";
            String answer = "";
            // 2. 加载对话历史（最多40条）
            String rawHistory = "";
            String judgePrompt = Prompts.judgePrompt(userMessage,rawHistory);
            String judgeString = model.generate(judgePrompt);
            System.out.println("judgeString:"+judgeString);
            if(judgeString.equals("发送命令")){
                prompt="控制机器人"+userMessage;
            }else{
                prompt="控制机器人说话："+judgeString;
            }
            // 1. 检索相关文档
            List<Content> retrievedDocs = retriever.retrieve(Query.from(prompt));
            List<String> textContents = new ArrayList<>();
            for (Content content : retrievedDocs) {
                TextSegment textSegment = content.textSegment();
                textContents.add(textSegment.text());
            }
            System.out.println("content:"+textContents);
            // 3. 构建最终Prompt
            String finalPrompt = Prompts.testPrompt(userMessage, textContents);
            System.out.println("finalPrompt:"+finalPrompt);
            // 4. 调用模型生成回答
            answer = model.generate(finalPrompt);
            return answer;
        } catch (Exception e) {
            return "服务暂时不可用，请稍后再试";
        }
    }

    public String loadConversationHistory(String conversationId) {
        StringBuilder history = new StringBuilder();
        List<Message> messages = messageMapper.selectList(new QueryWrapper<Message>()
                .eq("message_con_id", conversationId)
                .eq("message_delete_flag",0)
                .orderByAsc("message_time")
                .orderByDesc("message_role"));
        if(messages.size()<=40){
            for (Message message : messages) {
                String role = message.getMessageRole();
                String content = message.getMessageContent();
                // 根据角色转换为 Qwen 标签
                String tag = role.equals("User") ? "<|user|>" : "<|assistant|>";
                history.append(tag).append("\n").append(content).append("\n</s>\n");
            }
        }
        else{
            for(int i=0;i<=40;i++){
                Message message = messages.get(i);
                String role = message.getMessageRole();
                String content = message.getMessageContent();
                // 根据角色转换为 Qwen 标签
                String tag = role.equals("User") ? "<|user|>" : "<|assistant|>";
                history.append(tag).append("\n").append(content).append("\n</s>\n");
            }
        }
        String historyStr = history.toString();
        return historyStr;
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
//    @Bean
//    public static AICustomer create(EmbeddingStore<TextSegment> embeddingStore){
//        ChatLanguageModel model = ModelUtil.getMyModel();
//        EmbeddingModel embeddingModel = ModelUtil.getMyEmbeddingModel();
////        System.out.println("start chroma");
////        EmbeddingStore<TextSegment> embeddingStore = ChromaEmbeddingStore.builder()
////                .baseUrl("http://127.0.0.1:8000")
////                .collectionName("funny-rag")
////                .build();
////        System.out.println("end chroma");
//        ContentRetriever contentRetriever = EmbeddingStoreContentRetriever.builder()
//                .embeddingStore(embeddingStore)
//                .embeddingModel(embeddingModel)
//                .maxResults(5)
//                .minScore(0.6)
//                .build();
//        ContentInjector contentInjector = new DefaultContentInjector();
//        DefaultRetrievalAugmentor retrievalAugmentor = DefaultRetrievalAugmentor.builder()
//                .contentRetriever(contentRetriever)
//                .contentInjector(contentInjector)
//                .build();
////        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
//        return AiServices.builder(AICustomer.class)
//                .chatLanguageModel(model)
//                .retrievalAugmentor(retrievalAugmentor)
////                .tools(new AITools())
////                .chatMemory(chatMemory)
//                .build();
//
//    }
//    public String answerQuestion(Prompt prompt) {
//        return aiCustomer.answer(prompt);
//    }

}
