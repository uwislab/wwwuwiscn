package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class User {
    @TableId
    private String userId;
    private String userName;
    private Integer userImage;
    private Integer userBack;
    private String userSignature;
    private Integer userSex;
    private Integer userViolation;
    private String userCreateTime;
    private Integer userStatus;
}
