package org.example.springbootrobot.bean;

public class Role {
    private int role_id;
    private String role_name;
    private String description;

    public Role() {
    }

    public Role(int role_id, String role_name, String description) {
        this.role_id = role_id;
        this.role_name = role_name;
        this.description = description;
    }

    public int getRole_id() {
        return role_id;
    }

    public String getRole_name() {
        return role_name;
    }

    public String getDescription() {
        return description;
    }

    public void setRole_id(int role_id) {
        this.role_id = role_id;
    }

    public void setRole_name(String role_name) {
        this.role_name = role_name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Role{" +
                "role_id=" + role_id +
                ", role_name='" + role_name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}