package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.Notification;
import org.example.springbootrobot.dao.NotificationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class NotificationController {

    @Autowired
    private NotificationDao notificationDao;

    @RequestMapping("/addNotification")
    public String addNotification(@RequestBody Notification notification) {
        HashMap<String, Object> res = new HashMap<>();
        int result = notificationDao.addNotification(notification);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "通知添加成功");
        } else {
            res.put("code", 500);
            res.put("msg", "通知添加失败");
        }
        return JSON.toJSONString(res);
    }

    @RequestMapping("/getNotificationsByRecipientId")
    public String getNotificationsByRecipientId(int recipient_id) {
        HashMap<String, Object> res = new HashMap<>();
        List<Notification> notifications = notificationDao.getNotificationsByRecipientId(recipient_id);
        res.put("data", notifications);
        res.put("code", 200);
        res.put("msg", "查询成功");
        return JSON.toJSONString(res);
    }

    @RequestMapping("/markNotificationAsRead")
    public String markNotificationAsRead(int notification_id) {
        HashMap<String, Object> res = new HashMap<>();
        int result = notificationDao.markNotificationAsRead(notification_id);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "标记为已读成功");
        } else {
            res.put("code", 500);
            res.put("msg", "标记为已读失败");
        }
        return JSON.toJSONString(res);
    }
}