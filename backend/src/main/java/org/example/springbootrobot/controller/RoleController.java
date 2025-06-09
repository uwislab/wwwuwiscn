package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.Role;
import org.example.springbootrobot.dao.RoleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class RoleController {

    @Autowired
    private RoleDao roleDao;

    @RequestMapping("/roles")
    public String getRoleList() {
        HashMap<String, Object> data = new HashMap<>();
        int status = 404;  //错误404    成果200
        List<Role> roles = roleDao.getRoleList();
        if (roles != null) {
            data.put("roles", roles);
            data.put("status", 200);
        } else {
            data.put("status", 404);
        }
        return JSON.toJSONString(data);
    }
}
