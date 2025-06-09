package org.example.springbootrobot.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.springbootrobot.bean.Project;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ProjectDao {

    public List<Project> getAllProject(@Param("title") String title, @Param("pageStart") int PageStart, @Param("pageSize") int pageSize);

    public int getProjectCounts(@Param("title") String title);

    public int insertProject(Project project);

    public List<Project> getAllProjectWithCreator(@Param("title") String title, @Param("pageStart") int pageStart, @Param("pageSize") int pageSize);

    public List<Project> getProjectsByUserId(@Param("userId") Integer userId,
                                             @Param("title") String title,
                                             @Param("pageStart") int pageStart,
                                             @Param("pageSize") int pageSize);

    int getProjectCountsByUserId(@Param("userId") Integer userId, @Param("title") String name);

    public Project getProjectById(int projectId);

    public int deleteProject(int projectId);

    public int updateProject(Project project);

    int updateVisibilityById(@Param("project_id") int projectId, @Param("visibility") int visibility);

    //获取 visibility 为 0 的项目列表
    public List<Project> getAllVisibleProjects(@Param("title") String title, @Param("pageStart") int pageStart, @Param("pageSize") int pageSize);

    //获取项目的点赞数
    public int getProjectLikeCount(@Param("project_id") int projectId);

    //获取项目的收藏数
    public int getProjectFavoriteCount(@Param("project_id") int projectId);

}
