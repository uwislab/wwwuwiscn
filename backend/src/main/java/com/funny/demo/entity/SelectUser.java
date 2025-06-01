package com.funny.demo.entity;

import lombok.Data;

@Data
public class SelectUser {
    private String userId;
    private String startTime;
    private String endTime;
    private Integer currentPage;
    private Integer pageSize;
}
