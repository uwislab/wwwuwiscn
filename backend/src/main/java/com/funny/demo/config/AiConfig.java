package com.funny.demo.config;


import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiLanguageModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.redis.RedisEmbeddingStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {
    @Bean
    public static OllamaChatModel ollamaChatModel() {

        OllamaChatModel model =  OllamaChatModel.builder()
                .baseUrl("http://127.0.0.1:11434")
                .modelName("Funny")
                .temperature(0.1)
                .logRequests(true)
                .logResponses(true)
                .build();
        return model;
    }
    @Bean static OpenAiChatModel openAiChatModel() {
        OpenAiChatModel model = OpenAiChatModel.builder()
                .baseUrl("https://api.deepseek.com/v1")
                .modelName("deepseek-chat")
                .apiKey("sk-2ec8e11e704b406cab2ebba96010d276")
                .temperature(0.1)
                .logRequests(true)
                .logResponses(true)
                .build();
        return model;
    }
    @Bean
    public static EmbeddingModel embeddingModel() {
        EmbeddingModel embeddingModel = OllamaEmbeddingModel.builder()
                .baseUrl("http://127.0.0.1:11434")
                .modelName("Funny")
                .build();
        return embeddingModel;
    }
    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return RedisEmbeddingStore.builder()
                .host("127.0.0.1")
                .port(6379)
                .dimension(3584)
                .indexName("funny")
                .build();
    }
    @Bean
    public ContentRetriever contentRetriever(EmbeddingStore<TextSegment> embeddingStore, EmbeddingModel embeddingModel) {
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(10)
                .minScore(0.4)
                .build();
    }
}
