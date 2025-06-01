package com.funny.demo.mapper.adminMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.Set;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SetMapper extends BaseMapper<Set> {
    Integer updateUserImage(Integer pictureId);
    Integer updateRobotImage(Integer pictureId);
    Integer updateBack(Integer pictureId);
    Integer updateAdminImage(Integer pictureId);
}
