package org.example.springbootrobot.bean;

import java.time.LocalDateTime;
import java.util.List;

public class Comment {
    private int comment_id;
    private int user_id;
    private int project_id;
    private Integer parent_comment_id;
    private String content;
    private String created_at;

    // 新增字段，用于存储回复评论列表
    private List<Comment> replies;

    public Comment() {
    }

    public Comment(int comment_id, int user_id, int project_id, Integer parent_comment_id, String content, String created_at) {
        this.comment_id = comment_id;
        this.user_id = user_id;
        this.project_id = project_id;
        this.parent_comment_id = parent_comment_id;
        this.content = content;
        this.created_at = created_at;
    }

    public int getComment_id() {
        return comment_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public int getProject_id() {
        return project_id;
    }

    public Integer getParent_comment_id() {
        return parent_comment_id;
    }

    public String getContent() {
        return content;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setComment_id(int comment_id) {
        this.comment_id = comment_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public void setParent_comment_id(Integer parent_comment_id) {
        this.parent_comment_id = parent_comment_id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public List<Comment> getReplies() {
        return replies;
    }

    public void setReplies(List<Comment> replies) {
        this.replies = replies;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "comment_id=" + comment_id +
                ", user_id=" + user_id +
                ", project_id=" + project_id +
                ", parent_comment_id=" + parent_comment_id +
                ", content='" + content + '\'' +
                ", created_at='" + created_at + '\'' +
                ", replies=" + replies +
                '}';
    }
}