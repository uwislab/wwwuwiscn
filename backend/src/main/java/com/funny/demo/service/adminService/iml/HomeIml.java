package com.funny.demo.service.adminService.iml;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.funny.demo.entity.HomeCount;
import com.funny.demo.entity.User;
import com.funny.demo.mapper.userMapper.UserMapper;
import com.funny.demo.service.adminService.HomeService;
import com.funny.demo.tools.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HomeIml implements HomeService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public Result getCount() {
        HomeCount result = new HomeCount();
        int totalCount = userMapper.selectCount(null).intValue();
        int frozenCount = userMapper.selectCount(new QueryWrapper<User>().eq("user_status", 1)).intValue();
        int girlCount = userMapper.selectCount(new QueryWrapper<User>().eq("user_sex", 2)).intValue();
        int boyCount = userMapper.selectCount(new QueryWrapper<User>().eq("user_sex", 1)).intValue();
        int unknowCount = userMapper.selectCount(new QueryWrapper<User>().eq("user_sex", 0)).intValue();
        result.setTotalNum(totalCount);
        result.setFrozenNum(frozenCount);
        result.setGirlNum(girlCount);
        result.setBoyNum(boyCount);
        result.setUnknownNum(unknowCount);
        return new Result(true,result,"获取首页数据成功");
    }
}
