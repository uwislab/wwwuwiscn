package com.funny.demo.controller.userController;

import com.funny.demo.service.userService.RobotService;
import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/funny/robot")
public class RobotController {
    @Resource
    private RobotService robotService;
//    处理文字控制机器人
    @GetMapping("/controlRobotByText")
    public Result controlRobotByText(@RequestParam String userMessage, @RequestParam String conversationId){
        return robotService.controlRobotByText(userMessage,conversationId);
    }
//    处理语音控制机器人
    @PostMapping("/controlRobotByVoice")
    public Result controlRobotByVoice(@RequestBody MultipartFile file, @RequestParam String conversationId, @RequestParam Integer duration){
        return robotService.controlRobotByVoice(file,conversationId,duration);
    }

}
