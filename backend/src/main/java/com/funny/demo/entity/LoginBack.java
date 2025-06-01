package com.funny.demo.entity;

import lombok.Data;

@Data
public class LoginBack {
    private User userInfo;
    private String pictureUrl;
    private String token;
    private String backUrl;
}
