package com.funny.demo.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Conversation {
    @TableId
    private String conId;
    private String conUserId;
    private String conCreatedTime;
    private Integer conAiImage;
    private String conAiName;
    private String conAiNotes;
    private Integer conAiStyle;
    private Integer conDeleteFlag;
    private String lastMessage;
    private String lastMessageTime;
}
