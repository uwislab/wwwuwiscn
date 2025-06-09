package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.*;
import org.example.springbootrobot.dao.CommentDao;
import org.example.springbootrobot.dao.ProjectDao;
import org.example.springbootrobot.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;


@RestController
public class ProjectController {

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CommentDao commentDao;

    @RequestMapping("/allProject")
    public String getProjectList(QueryInfo queryInfo){

        //获取最大列表和当前编号
        int numbers = projectDao.getProjectCounts("%"+queryInfo.getQuery()+"%");
        int pageStart = (queryInfo.getPageNum()-1)*queryInfo.getPageSize();

        List<Project> project = projectDao.getAllProjectWithCreator("%"+queryInfo.getQuery()+"%",pageStart,queryInfo.getPageSize());
        HashMap<String,Object> res = new HashMap<>();
        res.put("numbers",numbers);
        res.put("data",project);
        String res_string = JSON.toJSONString(res);
        return res_string;
    }

    @RequestMapping("/myProject")
    public String getProjectListByuserid(QueryInfo queryInfo, Integer userId){

        HashMap<String, Object> res = new HashMap<>();

        // 校验用户ID是否为空
        if (userId == null || userId <= 0) {
            res.put("code", 400);
            res.put("msg", "用户ID无效");
            return JSON.toJSONString(res);
        }

        // 构造模糊查询参数
        String name = "%" + queryInfo.getQuery() + "%";
        int pageStart = (queryInfo.getPageNum() - 1) * queryInfo.getPageSize();

        // 查询总数
        int total = projectDao.getProjectCountsByUserId(userId, name);

        // 查询当前页数据
        List<Project> projects = projectDao.getProjectsByUserId(userId, name, pageStart, queryInfo.getPageSize());

        res.put("numbers", total);
        res.put("data", projects);
        res.put("code", 200);
        res.put("msg", "查询成功");

        return JSON.toJSONString(res);
    }

    @RequestMapping("/addProject")
    public String addProject(@RequestBody Project project) {
        HashMap<String, Object> res = new HashMap<>();

        // 1. 校验参数是否为空
        if (project == null) {
            res.put("code", 400);
            res.put("msg", "请求数据不能为空");
            return JSON.toJSONString(res);
        }

        Integer userId = project.getUser_id();
        String projectName = project.getTitle();

        // 2. 校验用户是否存在
        if (userId == null || userDao.getUserById(userId) == null) {
            res.put("code", 400);
            res.put("msg", "用户不存在，无法创建项目");
            return JSON.toJSONString(res);
        }

        // 3. 校验项目名称是否为空或过长
        if (projectName == null || projectName.trim().isEmpty()) {
            res.put("code", 400);
            res.put("msg", "项目名称不能为空");
            return JSON.toJSONString(res);
        }
        if (projectName.length() > 100) {
            res.put("code", 400);
            res.put("msg", "项目名称不能超过100个字符");
            return JSON.toJSONString(res);
        }

        // 4. 设置创建时间
        if (project.getCreated_at() == null) {
            project.setCreated_at(LocalDateTime.now().toString());
        }

        // 5. 执行插入操作
        try {
            int result = projectDao.insertProject(project);
            if (result == 1) {
                res.put("code", 200);
                res.put("msg", "保存成功");
                res.put("id", project.getProject_id());
            } else {
                res.put("code", 500);
                res.put("msg", "数据库插入失败，请检查字段约束或表结构");
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.put("code", 500);
            res.put("msg", "服务器内部错误：" + e.getMessage());
        }

        return JSON.toJSONString(res);
    }

    @RequestMapping("/deleteProject")
    public String deleteProject(int id) {
        int i = projectDao.deleteProject(id);
        return i>0?"success":"failure";
    }

//    @RequestMapping("/deleteProject")
//    public String deleteProject(Integer id) {
//        int i = projectDao.deleteProject(id);
//        return i>0?"success":"failure";
//    }

    @RequestMapping("/getUpdataProject")
    public String getUpdataProject(Integer id) {
        Project project = projectDao.getProjectById(id);
        String string = JSON.toJSONString(project);
        return string;
    }

    @RequestMapping("/editProject")
    public String editProject(@RequestBody Project project){
        int i = projectDao.updateProject(project);
        return i>0?"success":"failure";
    }

    @RequestMapping("/toggleVisibility")
    public String toggleVisibility(int id) {
        HashMap<String, Object> res = new HashMap<>();

        // 1. 查询项目是否存在
        Project project = projectDao.getProjectById(id);
        if (project == null) {
            res.put("code", 400);
            res.put("msg", "项目不存在");
            return JSON.toJSONString(res);
        }

        // 2. 获取当前 visibility 值
        int currentVisibility = project.getVisibility();
        int newVisibility = currentVisibility == 1 ? 0 : 1;

        // 3. 执行更新
        int result = projectDao.updateVisibilityById(id, newVisibility);

        if (result > 0) {
            res.put("code", 200);
            if (currentVisibility == 1) {
                res.put("msg", "取消发布成功");
            } else {
                res.put("msg", "发布成功");
            }
            res.put("visibility", newVisibility);
        } else {
            res.put("code", 500);
            res.put("msg", "状态更新失败，请重试");
        }

        return JSON.toJSONString(res);
    }

    @RequestMapping("/allVisibleProjects")
    public String getAllVisibleProjects(QueryInfo queryInfo) {

        // 获取最大列表和当前编号
        int numbers = projectDao.getProjectCounts("%"+queryInfo.getQuery()+"%");
        int pageStart = (queryInfo.getPageNum()-1)*queryInfo.getPageSize();

        List<Project> projects = projectDao.getAllVisibleProjects("%"+queryInfo.getQuery()+"%", pageStart, queryInfo.getPageSize());

        // 为每个项目添加点赞数、收藏数和评论信息
        for (Project project : projects) {
            int likeCount = projectDao.getProjectLikeCount(project.getProject_id());
            int favoriteCount = projectDao.getProjectFavoriteCount(project.getProject_id());
            project.setLike_count(likeCount);
            project.setFavorite_count(favoriteCount);

            List<Comment> comments = commentDao.getCommentsByProjectId(project.getProject_id());
            project.setComments(comments);
        }

        HashMap<String, Object> res = new HashMap<>();
        res.put("numbers", numbers);
        res.put("data", projects);
        String res_string = JSON.toJSONString(res);
        return res_string;
    }


}
