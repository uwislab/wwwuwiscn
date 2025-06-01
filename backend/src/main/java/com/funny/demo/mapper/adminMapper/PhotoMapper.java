package com.funny.demo.mapper.adminMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.Photo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface PhotoMapper extends BaseMapper<Photo> {
}
