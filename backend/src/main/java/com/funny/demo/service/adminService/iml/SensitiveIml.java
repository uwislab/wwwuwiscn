package com.funny.demo.service.adminService.iml;

import com.funny.demo.entity.Sensitive;
import com.funny.demo.mapper.adminMapper.SensitiveMapper;
import com.funny.demo.service.adminService.SensitiveService;
import com.funny.demo.tools.Result;
import com.github.houbb.sensitive.word.bs.SensitiveWordBs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensitiveIml implements SensitiveService {
    @Autowired
    private SensitiveMapper sensitiveMapper;
    @Autowired
    private SensitiveWordBs sensitiveWordBs;
    @Override
    public Result getAllWords() {
        List<Sensitive> result = sensitiveMapper.selectList(null);
        return new Result(true,result,"查询敏感词成功");
    }
    @Override
    public Result deleteWord(Integer sensitiveId) {
        String word = sensitiveMapper.selectById(sensitiveId).getSenWord();
        sensitiveWordBs.removeWord(word);
        int result = sensitiveMapper.deleteById(sensitiveId);
        if(result==0){
            return new Result(false,"删除敏感词失败");
        }
        return new Result(true, "删除敏感词成功");
    }
    @Override
    public Result addWord(String sensitiveWord){
        sensitiveWordBs.addWord(sensitiveWord);
        Sensitive sensitive = new Sensitive();
        sensitive.setSenWord(sensitiveWord);
        int result = sensitiveMapper.insert(sensitive);
        if(result==0){
            return new Result(false,"添加敏感词失败");
        }
        return new Result(true, "添加敏感词成功");
    }
}
