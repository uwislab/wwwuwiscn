package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.example.springbootrobot.bean.Role;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface RoleDao {
    List<Role> getRoleList();
}