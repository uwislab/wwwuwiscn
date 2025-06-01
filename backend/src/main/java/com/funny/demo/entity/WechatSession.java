package com.funny.demo.entity;

import lombok.Data;

@Data
public class WechatSession {
    private String openId;
    private String sessionKey;
}
