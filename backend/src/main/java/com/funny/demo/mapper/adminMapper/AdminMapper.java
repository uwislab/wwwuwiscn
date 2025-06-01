package com.funny.demo.mapper.adminMapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Mapper
public interface AdminMapper extends BaseMapper<Admin> {
    int changeAdminPassword(String adminId, String adminPassword);
    int changeAdmin(String adminId, String adminEmail, String adminPhone);

    void updateAdminImage(Integer pictureId, Integer setAdminImage);

    void changeAdminImage(int pictureId, String adminId);
}