package com.funny.demo.mapper.userMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserMapper extends BaseMapper<User> {
    Boolean changeUserName(String userName, String userId);
    Boolean changeUserImage(Integer userImage, String userId);
    Boolean changeUserBack(Integer userBack, String userId);
    Boolean changeUserSignature(String userSignature, String userId);
    Boolean changeUserSex(Integer userSex, String userId);
    void updateUserImage(String userId, Integer setUserImage);

    void updateUserBack(String userId, Integer setBack);
    void updateUserAvatar(Integer pictureId, Integer setUserImage);

    void updateBack(Integer pictureId, Integer setBack);

    void frozenUser(String userId);

    void frozenUsers();

    void unfrozenUser(String userId);

    void changeUserViolence(String userId);


    int applyUnfrozen(String userId);

    void unfrozenUsers();
}
