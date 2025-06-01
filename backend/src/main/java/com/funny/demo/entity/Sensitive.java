package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Sensitive {
    @TableId
    private Integer senId;
    private String senWord;
    private String senCreateTime;
}