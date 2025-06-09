package org.example.springbootrobot.bean;

import java.util.List;

public class Project {
    private int project_id;
    private int user_id;
    private String title;
    private String description;
    private String c_code;
    private int visibility;
    private String created_at;
    private int view_count;
    private int like_count;
    private String userName;
    private int favorite_count;
    private List<Comment> comments;

    public Project() {
    }

    public Project(int project_id, int user_id, String title, String description, String c_code, int visibility, String created_at, int view_count, int like_count) {
        this.project_id = project_id;
        this.user_id = user_id;
        this.title = title;
        this.description = description;
        this.c_code = c_code;
        this.visibility = visibility;
        this.created_at = created_at;
        this.view_count = view_count;
        this.like_count = like_count;
    }

    public int getProject_id() {
        return project_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getC_code() {
        return c_code;
    }

    public int getVisibility() {
        return visibility;
    }

    public String getCreated_at() {
        return created_at;
    }

    public int getView_count() {
        return view_count;
    }

    public int getLike_count() {
        return like_count;
    }

    public String getUserName() {
        return userName;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setC_code(String c_code) {
        this.c_code = c_code;
    }

    public void setVisibility(int visibility) {
        this.visibility = visibility;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public void setView_count(int view_count) {
        this.view_count = view_count;
    }

    public void setLike_count(int like_count) {
        this.like_count = like_count;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getFavorite_count() {
        return favorite_count;
    }

    public void setFavorite_count(int favorite_count) {
        this.favorite_count = favorite_count;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    @Override
    public String toString() {
        return "Project{" +
                "project_id=" + project_id +
                ", user_id=" + user_id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", c_code='" + c_code + '\'' +
                ", visibility=" + visibility +
                ", created_at='" + created_at + '\'' +
                ", view_count=" + view_count +
                ", like_count=" + like_count +
                '}';
    }
}