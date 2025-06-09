package org.example.springbootrobot.bean;

public class Menu {
    private int id;
    private String name;
    private int required_role_id;
    private int morder;
    private String location;
    private String icon;

    public Menu() {
    }

    public Menu(int id, String name, int required_role_id, int morder, String location, String icon) {
        this.id = id;
        this.name = name;
        this.required_role_id = required_role_id;
        this.morder = morder;
        this.location = location;
        this.icon = icon;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRequired_role_id() {
        return required_role_id;
    }

    public void setRequired_role_id(int required_role_id) {
        this.required_role_id = required_role_id;
    }

    public int getMorder() {
        return morder;
    }

    public void setMorder(int morder) {
        this.morder = morder;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    @Override
    public String toString() {
        return "Menu{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", required_role_id=" + required_role_id +
                ", morder=" + morder +
                ", location='" + location + '\'' +
                ", icon='" + icon + '\'' +
                '}';
    }
}