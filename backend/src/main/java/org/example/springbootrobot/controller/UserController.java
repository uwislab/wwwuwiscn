package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.QueryInfo;
import org.example.springbootrobot.bean.User;
import org.example.springbootrobot.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserDao uDao;

    @RequestMapping("/allUser")
    public String getUserList(QueryInfo queryInfo){

        //获取最大列表和当前编号
        int numbers = uDao.getUserCounts("%"+queryInfo.getQuery()+"%");
        int pageStart = (queryInfo.getPageNum()-1)*queryInfo.getPageSize();

        List<User> users = uDao.getAllUser("%"+queryInfo.getQuery()+"%",pageStart,queryInfo.getPageSize());
        HashMap<String,Object> res = new HashMap<>();
        res.put("numbers",numbers);
        res.put("data",users);
        String res_string = JSON.toJSONString(res);
        return res_string;
    }



    @PostMapping("/resetPassword")
    public String resetPassword(@RequestParam("id") Integer id, @RequestParam("password") String password) {
        // 直接使用固定密码"123"
        final String DEFAULT_PASSWORD = "123";

        // 1. 检查用户是否存在
        User user = uDao.getUserById(id);
        if (user == null) {
            return "user_not_found";
        }

        // 2. 执行密码重置操作
        int result = uDao.resetPassword(id, DEFAULT_PASSWORD);

        // 3. 返回明确的操作结果
        return result > 0 ? "success" : "failure";
    }

    @PostMapping("/checkUsername")
    public String checkUsername(@RequestBody QueryInfo queryInfo) {
        String username = queryInfo.getQuery();
        boolean exists = uDao.countByUsername(username);
        HashMap<String, Object> res = new HashMap<>();
        res.put("exists", exists);
        String res_string = JSON.toJSONString(res);
        return res_string;
    }

    @RequestMapping("/addUser")
    public String addUser(@RequestBody User user){
        //System.out.println("Received user: " + user.getUsername());
        // 校验 username 是否为空或无效
        if (user.getUsername() == null || user.getUsername().isEmpty() || user.getUsername().equalsIgnoreCase("boolean")) {
            return "invalid_username";
        }
        if (uDao.countByUsername(user.getUsername())) {
            return "exists";
        }
        user.setRole_id(1);
        int i = uDao.addUser(user);
        String str = i >0?"success":"error";
        return str;
    }


    @RequestMapping("/deleteUser")
    public String deleteUser(int id) {
        int i = uDao.deleteUser(id);
        return i>0?"success":"failure";
    }

    @RequestMapping("/getUpdataUser")
    public String getUpdataUser(Integer id) {
        User user = uDao.getUserById(id);
        String string = JSON.toJSONString(user);
        return string;
    }

    @RequestMapping("/editUser")
    public String editUser(@RequestBody User user){
        int i = uDao.updateUser(user);
        return i>0?"success":"failure";
    }

    @RequestMapping("/getUserById")
    public String getUserById(@RequestParam("id") int userId) {
        HashMap<String, Object> res = new HashMap<>();
        User user = uDao.getUserById(userId);
        if (user == null) {
            res.put("code", 404);
            res.put("msg", "用户不存在");
        } else {
            res.put("code", 200);
            res.put("msg", "success");
            res.put("data", user.getUsername());
        }

        return JSON.toJSONString(res);
    }


}
