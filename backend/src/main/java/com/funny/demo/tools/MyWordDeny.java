package com.funny.demo.tools;

import com.funny.demo.entity.Sensitive;
import com.funny.demo.mapper.adminMapper.SensitiveMapper;
import com.github.houbb.sensitive.word.api.IWordDeny;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

public class MyWordDeny implements IWordDeny {
    private final SensitiveMapper sensitiveMapper;

    // 构造函数注入 SensitiveMapper
    public MyWordDeny(SensitiveMapper sensitiveMapper) {
        this.sensitiveMapper = sensitiveMapper;
    }
    @Override
    public List<String> deny() {
        List<Sensitive> sensitiveList = sensitiveMapper.selectList(null);
        List<String> sensitiveWords = sensitiveList.stream().map(Sensitive::getSenWord).toList();
        return sensitiveWords;
    }
}
