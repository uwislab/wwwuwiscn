package org.example.springbootrobot.controller;

import com.alibaba.fastjson.JSON;
import org.example.springbootrobot.bean.Comment;
import org.example.springbootrobot.dao.CommentDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class CommentController {

    @Autowired
    private CommentDao commentDao;

    @RequestMapping("/addComment")
    public String addComment(@RequestBody Comment comment) {
        HashMap<String, Object> res = new HashMap<>();
        int result = commentDao.addComment(comment);
        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "评论成功");
        } else {
            res.put("code", 500);
            res.put("msg", "评论失败");
        }
        return JSON.toJSONString(res);
    }

    @RequestMapping("/getCommentsByProjectId")
    public String getCommentsByProjectId(int project_id) {
        HashMap<String, Object> res = new HashMap<>();
        List<Comment> comments = commentDao.getCommentsByProjectId(project_id);
        // 为每个评论添加回复列表
        for (Comment comment : comments) {
            List<Comment> replies = commentDao.getRepliesByCommentId(comment.getComment_id());
            comment.setReplies(replies);
        }
        res.put("data", comments);
        res.put("code", 200);
        res.put("msg", "查询成功");
        return JSON.toJSONString(res);
    }

    // 删除评论接口
    @RequestMapping("/deleteComment")
    public String deleteComment(int comment_id, int user_id) {
        HashMap<String, Object> res = new HashMap<>();

        // 1. 检查评论是否存在
        int exists = commentDao.checkCommentExists(comment_id);
        if (exists == 0) {
            res.put("code", 404);
            res.put("msg", "评论不存在");
            return JSON.toJSONString(res);
        }

        // 2. 执行删除操作（会同时删除回复）
        int result = commentDao.deleteComment(comment_id, user_id);

        if (result > 0) {
            res.put("code", 200);
            res.put("msg", "删除成功");
        } else {
            res.put("code", 403);
            res.put("msg", "无权限删除");
        }
        return JSON.toJSONString(res);
    }

    //查询用户发表的评论
    @RequestMapping("/getUserComments")
    public String getUserComments(int user_id) {
        HashMap<String, Object> res = new HashMap<>();
        List<Comment> comments = commentDao.getCommentsByUserId(user_id);

        res.put("code", 200);
        res.put("msg", "查询成功");
        res.put("data", comments);

        return JSON.toJSONString(res);
    }

    //查询回复给用户的评论
    @RequestMapping("/getRepliesToUser")
    public String getRepliesToUser(int user_id) {
        HashMap<String, Object> res = new HashMap<>();
        List<Comment> replies = commentDao.getRepliesToUser(user_id);

        res.put("code", 200);
        res.put("msg", "查询成功");
        res.put("data", replies);

        return JSON.toJSONString(res);
    }

}