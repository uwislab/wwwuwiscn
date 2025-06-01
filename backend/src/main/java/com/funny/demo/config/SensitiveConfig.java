package com.funny.demo.config;

import cn.hutool.core.collection.CollUtil;
import com.funny.demo.entity.Sensitive;
import com.funny.demo.mapper.adminMapper.SensitiveMapper;
import com.funny.demo.service.adminService.SensitiveService;
import com.funny.demo.tools.MyWordDeny;
import com.github.houbb.sensitive.word.api.IWordDeny;
import com.github.houbb.sensitive.word.bs.SensitiveWordBs;
import com.github.houbb.sensitive.word.support.allow.WordAllows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.github.houbb.sensitive.word.support.deny.WordDenys;
import java.util.List;

@Configuration
public class SensitiveConfig {
    /**
     * 初始化敏感词过滤器（带数据库词库）
     */
    @Bean
    public SensitiveWordBs sensitiveWordBs(SensitiveMapper sensitiveMapper) {
        return SensitiveWordBs.newInstance()
                .enableUrlCheck(false)  // 关闭URL检测
                .enableNumCheck(false)  // 关闭数字检测
                .wordAllow(WordAllows.defaults())
                .wordDeny(new MyWordDeny(sensitiveMapper))
                .init();
    }
}
