package org.example.springbootrobot.controller;


import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.User;
import org.example.springbootrobot.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Objects;

@RestController
public class LoginController {

    @Autowired
    UserDao userDao;

    @RequestMapping("/login")
    public String login( @RequestBody User user) {

        String flag = "error";
        User us = userDao.getUserByMassage(user.getUsername(), user.getPassword());
        HashMap<String, Object> res = new HashMap<>();
        /**
         * if(us!=null){
         *             flag="ok";
         *             res.put("userId", us.getId());
         *             res.put("user_static", us.getUser_static());
         *         }
         *         res.put("flag",flag);
         *         res.put("user",user);
         */
        if (us != null) {
            res.put("flag", "ok");
            res.put("message", "登录成功");
            res.put("user", us);
        } else {
            res.put("flag", "error");
            res.put("message", "用户名或密码错误");
        }
        String res_json=JSON.toJSONString(res);
        return res_json;
    }
}
