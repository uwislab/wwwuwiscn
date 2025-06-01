package com.funny.demo.service.adminService.iml;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.funny.demo.entity.Admin;
import com.funny.demo.entity.SelectUser;
import com.funny.demo.entity.User;
import com.funny.demo.mapper.adminMapper.PictureMapper;
import com.funny.demo.mapper.userMapper.UserMapper;
import com.funny.demo.service.adminService.UserManageService;
import com.funny.demo.tools.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserManageIml implements UserManageService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PictureMapper pictureMapper;
    @Override
    public Result getAllUser(Integer currentPage, Integer pageSize) {
        if (currentPage == null || currentPage <= 0) {
            return new Result(false,  "当前页码无效");
        }
        try {
            // 创建分页对象
            Page<User> page = new Page<>(currentPage, pageSize);

            // 使用分页查询
            Page<User> result = userMapper.selectPage(page,null);

            // 返回结果
            return new Result(true, result, "获取用户列表成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, null, "获取用户列表失败：" + e.getMessage());
        }
    }
    @Override
    public Result selectUser(SelectUser selectUser) {
        Integer currentPage = selectUser.getCurrentPage();
        Integer pageSize = selectUser.getPageSize();
        if (currentPage == null || currentPage <= 0) {
            return new Result(false,  "当前页码无效");
        }
        try {
            // 创建分页对象
            Page<User> page = new Page<>(currentPage, pageSize);
            Page<User> result =null;
            if(selectUser.getUserId()!=null && selectUser.getStartTime()!=null && selectUser.getEndTime()!=null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .eq("user_id", selectUser.getUserId())
                        .between("user_create_time", selectUser.getStartTime(), selectUser.getEndTime())
                );
            }
            if(selectUser.getUserId()!=null && selectUser.getStartTime()!=null && selectUser.getEndTime()==null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .eq("user_id", selectUser.getUserId())
                        .ge("user_create_time", selectUser.getStartTime())
                );
            }
            if(selectUser.getUserId()!=null && selectUser.getStartTime()==null && selectUser.getEndTime()!=null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .eq("user_id", selectUser.getUserId())
                        .le("user_create_time", selectUser.getEndTime())
                );
            }
            if(selectUser.getUserId()==null && selectUser.getStartTime()!=null && selectUser.getEndTime()!=null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .between("user_create_time", selectUser.getStartTime(), selectUser.getEndTime())
                );
            }
            if(selectUser.getUserId()==null && selectUser.getStartTime()!=null && selectUser.getEndTime()==null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .ge("user_create_time", selectUser.getStartTime())
                );
            }
            if(selectUser.getUserId()==null && selectUser.getStartTime()==null && selectUser.getEndTime()!=null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .le("user_create_time", selectUser.getEndTime())
                );
            }
            if(selectUser.getUserId()!=null && selectUser.getStartTime()==null && selectUser.getEndTime()==null){
                 result = userMapper.selectPage(page, new QueryWrapper<User>()
                        .eq("user_id", selectUser.getUserId())
                );
            }
            // 返回结果
            return new Result(true, result, "获取用户列表成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, null, "获取用户列表失败：" + e.getMessage());
        }
    }
    @Override
    public Result getUserAvatar(Integer pictureId) {
        String result = pictureMapper.getUrlById(pictureId);
        try {
            return new Result(true, result, "获取用户头像成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, null, "获取用户头像失败：" + e.getMessage());
        }
    }
    @Override
    public Result frozenUser(String userId) {
        try {
            userMapper.frozenUser(userId);
            return new Result(true,  "冻结用户成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, "冻结用户失败：" + e.getMessage());
        }
    }
    @Override
    public Result frozenUsers() {
        try {
            userMapper.frozenUsers();
            return new Result(true,  "冻结所有用户成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, "冻结所有用户失败：" + e.getMessage());
        }
    }
    @Override
    public Result unfrozenUser(String userId) {
        try {
            userMapper.unfrozenUser(userId);
            return new Result(true,  "解冻用户成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, "解冻用户失败：" + e.getMessage());
        }
    }
    @Override
    public Result unfrozenUsers() {
        try {
            userMapper.unfrozenUsers();
            return new Result(true,  "解冻所有用户成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, "解冻所有用户失败：" + e.getMessage());
        }
    }
}
