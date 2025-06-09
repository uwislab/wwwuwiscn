package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.Favorite;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FavoriteDao {
    int addFavorite(Favorite favorite);
    int deleteFavorite(@Param("user_id") int user_id, @Param("project_id") int project_id);
    List<Favorite> getFavoritesByUserId(@Param("user_id") int user_id);
}