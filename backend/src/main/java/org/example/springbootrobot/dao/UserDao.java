package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserDao {
    public User getUserByMassage(@Param("username")String username, @Param("password")String password);

    public List<User> getAllUser(@Param("username") String username, @Param("pageStart") int PageStart, @Param("pageSize") int pageSize);

    public int getUserCounts(@Param("username") String username);

    public User getUserById(int id);

    public int resetPassword(Integer id, String password);

    public int addUser(User user);

    public int deleteUser(Integer userId);

    public int updateUser(User user);

    public boolean countByUsername(String username);

}