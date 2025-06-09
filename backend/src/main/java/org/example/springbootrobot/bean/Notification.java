package org.example.springbootrobot.bean;

import java.time.LocalDateTime;

public class Notification {
    private int notification_id;
    private int recipient_id;
    private int sender_id;
    private int type;
    private Integer project_id;
    private Integer comment_id;
    private boolean is_read;
    private String created_at;

    public Notification() {
    }

    public Notification(int notification_id, int recipient_id, int sender_id, int type, Integer project_id, Integer comment_id, boolean is_read, String created_at) {
        this.notification_id = notification_id;
        this.recipient_id = recipient_id;
        this.sender_id = sender_id;
        this.type = type;
        this.project_id = project_id;
        this.comment_id = comment_id;
        this.is_read = is_read;
        this.created_at = created_at;
    }

    public int getNotification_id() {
        return notification_id;
    }

    public int getRecipient_id() {
        return recipient_id;
    }

    public int getSender_id() {
        return sender_id;
    }

    public int getType() {
        return type;
    }

    public Integer getProject_id() {
        return project_id;
    }

    public Integer getComment_id() {
        return comment_id;
    }

    public boolean isIs_read() {
        return is_read;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setNotification_id(int notification_id) {
        this.notification_id = notification_id;
    }

    public void setRecipient_id(int recipient_id) {
        this.recipient_id = recipient_id;
    }

    public void setSender_id(int sender_id) {
        this.sender_id = sender_id;
    }

    public void setType(int type) {
        this.type = type;
    }

    public void setProject_id(Integer project_id) {
        this.project_id = project_id;
    }

    public void setComment_id(Integer comment_id) {
        this.comment_id = comment_id;
    }

    public void setIs_read(boolean is_read) {
        this.is_read = is_read;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "notification_id=" + notification_id +
                ", recipient_id=" + recipient_id +
                ", sender_id=" + sender_id +
                ", type=" + type +
                ", project_id=" + project_id +
                ", comment_id=" + comment_id +
                ", is_read=" + is_read +
                ", created_at='" + created_at + '\'' +
                '}';
    }
}