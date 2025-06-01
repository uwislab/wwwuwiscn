package com.funny.demo.service.adminService;


import com.funny.demo.tools.Result;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

public interface KnowledgeBaseService {
    Result addKnowledge(MultipartFile file);

    Result getKnowledge();
}
