package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Photo {
    @TableId
    private String photoId;
    private String photoAdminId;
    private String photoUrl;
    private Integer photoType;
    private String photoCreateTime;
}
