package com.funny.demo.entity;

import lombok.Data;

@Data
public class LoginRequest {
    private String code;
    private String rawData;
    private String signature;
    private String encryptedData;
    private String iv;
}
