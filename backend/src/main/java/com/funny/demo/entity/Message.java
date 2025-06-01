package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Message {
    @TableId
    private String messageId;// 消息id
    private String messageConId;// 会话id
    private Integer messageTypeFlag;// 消息类型
    private String messageContent;// 消息内容
    private String messageVoiceContent;// 语音消息内容路径
    private String messageRole;// 消息角色
    private String messageTime;// 消息时间
    private Integer messageDeleteFlag;//删除标志
    private Integer messagePlaying;//播放标志
    private Integer messageDuration;// 语音时长
    private Integer messageRecognition;// 语音识别标志
    private String messageRecText;// 语音识别文字
}
