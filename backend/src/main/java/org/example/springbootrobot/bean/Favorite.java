package org.example.springbootrobot.bean;

import java.time.LocalDateTime;

public class Favorite {
    private int favorite_id;
    private int user_id;
    private int project_id;
    private String created_at;

    public Favorite() {
    }

    public Favorite(int favorite_id, int user_id, int project_id, String created_at) {
        this.favorite_id = favorite_id;
        this.user_id = user_id;
        this.project_id = project_id;
        this.created_at = created_at;
    }

    public int getFavorite_id() {
        return favorite_id;
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

    public void setFavorite_id(int favorite_id) {
        this.favorite_id = favorite_id;
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
        return "Favorite{" +
                "favorite_id=" + favorite_id +
                ", user_id=" + user_id +
                ", project_id=" + project_id +
                ", created_at='" + created_at + '\'' +
                '}';
    }
}