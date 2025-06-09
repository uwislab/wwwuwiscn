package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.Notification;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface NotificationDao {
    int addNotification(Notification notification);
    List<Notification> getNotificationsByRecipientId(@Param("recipient_id") int recipient_id);
    int markNotificationAsRead(@Param("notification_id") int notification_id);
}