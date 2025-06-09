package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.Comment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface CommentDao {
    int addComment(Comment comment);
    List<Comment> getCommentsByProjectId(@Param("project_id") int project_id);

    //获取指定评论的回复列表
    List<Comment> getRepliesByCommentId(@Param("comment_id") int comment_id);

    //删除评论及其所有回复
    int deleteComment(@Param("comment_id") int comment_id, @Param("user_id") int user_id);

    //检查评论是否存在
    int checkCommentExists(@Param("comment_id") int comment_id);

    //查询用户发表的评论
    List<Comment> getCommentsByUserId(@Param("user_id") int user_id);

    //查询回复给用户的评论（即用户作为被回复对象的评论）
    List<Comment> getRepliesToUser(@Param("user_id") int user_id);

}
