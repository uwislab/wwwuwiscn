package com.funny.demo.service.adminService.iml;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.funny.demo.service.adminService.KnowledgeBaseService;
import com.funny.demo.tools.RedisFullQueryHelper;
import com.funny.demo.tools.Result;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentParser;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KnowledgeBaseIml implements KnowledgeBaseService {
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    @Autowired
    private RedisFullQueryHelper redisFullQueryHelper;
    @Override
    public Result addKnowledge(MultipartFile file) {
        try {
            // 检查文件是否为空
            if (file.isEmpty()) {
                return new Result(false, "上传的文件为空");
            }

            // 创建临时文件
            File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            try {
                // 将上传的文件内容复制到临时文件
                Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                return new Result(false, "文件保存到临时位置失败");
            }

            DocumentParser documentParser = new TextDocumentParser();
            Document document = FileSystemDocumentLoader.loadDocument(tempFile.getAbsolutePath(), documentParser);

            // 删除临时文件
            tempFile.delete();

            // 处理边界条件
            if (document == null || document.text() == null || document.text().isEmpty()) {
                return new Result(false, "文件为空");
            }

            String[] parts = document.text().split("\\s*\n\\s*\n\\s*");
            // 检查分割结果
            if (parts.length == 0) {
                return new Result(false, "文件内容无法按指定规则分割");
            }

            Boolean result = embeddingHandle(parts);
            if (!result) {
                return new Result(false, "知识库添加失败");
            }
            return new Result(true, "知识库添加成功");
        } catch (Exception e) {
            // 打印详细的异常信息，方便调试
            e.printStackTrace();
            return new Result(false, "知识库添加失败，具体错误信息：" + e.getMessage());
        }
    }
    public Boolean embeddingHandle(String[] parts){
        try{
            System.out.println("parts:"+parts);
            List<TextSegment> segments = new ArrayList<>();
            for (String part : parts) {
                if (!part.trim().isEmpty()) { // 过滤掉空段落
                    TextSegment textSegment = TextSegment.from(part);
                    segments.add(textSegment);
                }
            }
            List<Embedding> embeddings = embeddingModel.embedAll(segments).content();
            embeddingStore.addAll(embeddings, segments);
        }catch (Exception e){
            e.printStackTrace();
        }
        return true;
    }
    @Override
    public Result getKnowledge() {
        try{
            List<String> result = redisFullQueryHelper.getAllTextByKeyPattern();
            return new Result(true,result, "知识库查询成功");
        }catch(Exception e){
            e.printStackTrace();
            return new Result(false, "知识库查询失败");
        }
    }
}
