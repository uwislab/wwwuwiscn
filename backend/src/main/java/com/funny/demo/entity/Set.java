package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Set {
    @TableId
    private Integer setId;
    private Integer setUserImage;
    private Integer setBack;
    private Integer setRobotImage;
    private Integer setAdminImage;
}
