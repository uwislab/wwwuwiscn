package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Admin {
    @TableId
    private String adminId;
    private String adminName;
    private String adminPassword;
    private String adminEmail;
    private String adminCreateTime;
    private Integer adminImage;
    private String adminPhone;
    @TableField(exist = false)
    private String token;
    @TableField(exist = false)
    private String adminImageUrl;

}
