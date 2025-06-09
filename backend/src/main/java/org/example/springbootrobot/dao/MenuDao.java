package org.example.springbootrobot.dao;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.Menu;
import org.example.springbootrobot.bean.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MenuDao {

    public List<Menu> getMenuList();

    public List<Menu> getAllMenu(@Param("name") String name, @Param("pageStart") int PageStart, @Param("pageSize") int pageSize);

    public int getMenuCounts(@Param("name") String name);

    public int updateMenu(Menu menu);

    public Menu getMenuById(int id);

}
