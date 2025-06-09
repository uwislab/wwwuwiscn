package org.example.springbootrobot.bean;

import java.time.LocalDateTime;

public class Like {
    private int like_id;
    private int user_id;
    private int project_id;
    private String created_at;

    public Like() {
    }

    public Like(int like_id, int user_id, int project_id, String created_at) {
        this.like_id = like_id;
        this.user_id = user_id;
        this.project_id = project_id;
        this.created_at = created_at;
    }

    public int getLike_id() {
        return like_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public int getProject_id() {
        return project_id;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setLike_id(int like_id) {
        this.like_id = like_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    @Override
    public String toString() {
        return "Like{" +
                "like_id=" + like_id +
                ", user_id=" + user_id +
                ", project_id=" + project_id +
                ", created_at='" + created_at + '\'' +
                '}';
    }
}