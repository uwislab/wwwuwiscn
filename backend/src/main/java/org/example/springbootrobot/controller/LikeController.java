package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.Like;
import org.example.springbootrobot.dao.LikeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class LikeController {

    @Autowired
    private LikeDao likeDao;

    @RequestMapping("/addLike")
    public String addLike(@RequestBody Like like) {
        HashMap<String, Object> res = new HashMap<>();
        int result = likeDao.addLike(like);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "点赞成功");
        } else {
            res.put("code", 500);
            res.put("msg", "点赞失败");
        }
        return JSON.toJSONString(res);
    }

    @RequestMapping("/deleteLike")
    public String deleteLike(int user_id, int project_id) {
        HashMap<String, Object> res = new HashMap<>();
        int result = likeDao.deleteLike(user_id, project_id);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "取消点赞成功");
        } else {
            res.put("code", 500);
            res.put("msg", "取消点赞失败");
        }
        return JSON.toJSONString(res);
    }

    @RequestMapping("/getLikesByUserId")
    public String getLikesByUserId(int user_id) {
        HashMap<String, Object> res = new HashMap<>();
        List<Like> likes = likeDao.getLikesByUserId(user_id);
        res.put("data", likes);
        res.put("code", 200);
        res.put("msg", "查询成功");
        return JSON.toJSONString(res);
    }
}
