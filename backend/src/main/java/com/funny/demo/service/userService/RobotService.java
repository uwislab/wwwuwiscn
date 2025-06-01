package com.funny.demo.service.userService;

import com.funny.demo.tools.Result;
import org.springframework.web.multipart.MultipartFile;

public interface RobotService {
    public Result controlRobotByText(String userMessage, String conversationId);
    public Result controlRobotByVoice(MultipartFile userFile, String conversationId, Integer duration);
}
