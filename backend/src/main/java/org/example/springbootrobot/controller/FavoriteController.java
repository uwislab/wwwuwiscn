package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.Favorite;
import org.example.springbootrobot.dao.FavoriteDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class FavoriteController {

    @Autowired
    private FavoriteDao favoriteDao;

    @RequestMapping("/addFavorite")
    public String addFavorite(@RequestBody Favorite favorite) {
        HashMap<String, Object> res = new HashMap<>();
        int result = favoriteDao.addFavorite(favorite);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "收藏成功");
        } else {
            res.put("code", 500);
            res.put("msg", "收藏失败");
        }
        return JSON.toJSONString(res);
    }

    @RequestMapping("/deleteFavorite")
    public String deleteFavorite(int user_id, int project_id) {
        HashMap<String, Object> res = new HashMap<>();
        int result = favoriteDao.deleteFavorite(user_id, project_id);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "取消收藏成功");
        } else {
            res.put("code", 500);
            res.put("msg", "取消收藏失败");
        }
        return JSON.toJSONString(res);
    }

    @RequestMapping("/getFavoritesByUserId")
    public String getFavoritesByUserId(int user_id) {
        HashMap<String, Object> res = new HashMap<>();
        List<Favorite> favorites = favoriteDao.getFavoritesByUserId(user_id);
        res.put("data", favorites);
        res.put("code", 200);
        res.put("msg", "查询成功");
        return JSON.toJSONString(res);
    }
}