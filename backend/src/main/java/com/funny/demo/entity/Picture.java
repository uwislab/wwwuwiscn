package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Picture {
    @TableId
    private String pictureId;
    private String pictureUserId;
    private String pictureAdminId;
    private Integer pictureUpBy;
    private String pictureUrl;
    private Integer pictureType;
    private String pictureCreateTime;
}
