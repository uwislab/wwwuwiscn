package com.funny.demo.service.adminService;

import com.funny.demo.tools.Result;

public interface SensitiveService {
    Result getAllWords();
    Result deleteWord(Integer sensitiveId);

    Result addWord(String sensitiveWord);
}
