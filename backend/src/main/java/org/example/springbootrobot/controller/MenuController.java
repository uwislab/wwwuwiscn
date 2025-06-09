package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.Menu;
import org.example.springbootrobot.bean.QueryInfo;
import org.example.springbootrobot.bean.User;
import org.example.springbootrobot.dao.MenuDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class MenuController {

    @Autowired
    MenuDao menuDao;
    
    @RequestMapping("/menus")
    public String getMenuList() {
        HashMap<String, Object> data = new HashMap<>();
        int status = 404;  //错误404    成果200
        List<Menu> menus = menuDao.getMenuList();
        if (menus != null){
            data.put("menus",menus);
            data.put("status",200);
        }
        else {
            data.put("status",404);
        }
        String s = JSON.toJSONString(data);

        return s;
    }

    @RequestMapping("/allMenus")
    public String getMenuList(QueryInfo queryInfo){

        //获取最大列表和当前编号
        int numbers = menuDao.getMenuCounts("%"+queryInfo.getQuery()+"%");
        int pageStart = (queryInfo.getPageNum()-1)*queryInfo.getPageSize();

        List<Menu> menus = menuDao.getAllMenu("%"+queryInfo.getQuery()+"%",pageStart,queryInfo.getPageSize());
        HashMap<String,Object> res = new HashMap<>();
        res.put("numbers",numbers);
        res.put("data",menus);
        String res_string = JSON.toJSONString(res);
        return res_string;
    }

    @RequestMapping("/UpdataMenu")
    public String UpdataMenu(Integer id) {
        Menu menu = menuDao.getMenuById(id);
        String string = JSON.toJSONString(menu);
        return string;
    }

    @RequestMapping("/editMenu")
    public String editUser(@RequestBody Menu menu){
        int i = menuDao.updateMenu(menu);
        return i>0?"success":"failure";
    }

}
