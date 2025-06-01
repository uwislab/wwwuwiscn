package com.funny.demo.mapper.adminMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.funny.demo.entity.Picture;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface PictureMapper extends BaseMapper<Picture> {
    public int getIdByUrl(String url);
    public String getUrlById(Integer id);

    Integer changeType(Integer pictureType, Integer pictureId);
}
