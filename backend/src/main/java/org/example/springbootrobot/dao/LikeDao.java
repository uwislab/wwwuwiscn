package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.Like;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface LikeDao {
    int addLike(Like like);
    int deleteLike(@Param("user_id") int user_id, @Param("project_id") int project_id);
    List<Like> getLikesByUserId(@Param("user_id") int user_id);
}
