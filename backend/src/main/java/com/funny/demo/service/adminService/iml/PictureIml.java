package com.funny.demo.service.adminService.iml;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.funny.demo.entity.Picture;
import com.funny.demo.entity.Set;
import com.funny.demo.mapper.adminMapper.AdminMapper;
import com.funny.demo.mapper.adminMapper.PictureMapper;
import com.funny.demo.mapper.adminMapper.SetMapper;
import com.funny.demo.mapper.userMapper.ConversationMapper;
import com.funny.demo.mapper.userMapper.UserMapper;
import com.funny.demo.service.adminService.PictureService;
import com.funny.demo.tools.JwtTokenProvider;
import com.funny.demo.tools.OSSUtil;
import com.funny.demo.tools.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PictureIml implements PictureService {
    @Autowired
    private OSSUtil ossUtil;
    @Autowired
    private PictureMapper pictureMapper;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private SetMapper setMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ConversationMapper conversationMapper;
    @Autowired
    private AdminMapper adminMapper;
    @Override
    public Result getAvatar(Integer currentPage, Integer pictureType, Integer pageSize, Integer pictureUpBy ) {
        if (currentPage == null || currentPage <= 0) {
            return new Result(false, "当前页码无效");
        }
        try {
            // 创建分页对象
            Page<Picture> page = new Page<>(currentPage, pageSize);
            System.out.println("pictureType"+pictureType);
            Page<Picture> result =null;
//            查询聊天背景
            if(pictureType==1){
                 result = pictureMapper.selectPage(page,new QueryWrapper<Picture>()
                        .eq("picture_type", pictureType)
                        .eq("picture_up_by", pictureUpBy));
            }else{
//            查询头像图片
                result = pictureMapper.selectPage(page,new QueryWrapper<Picture>()
                        .in("picture_type", 0, 2,3)
                        .eq("picture_up_by", pictureUpBy));
            }
            // 返回结果
            return new Result(true, result, "获取照片列表成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, "获取用户列表失败：" + e.getMessage());
        }
    }

    @Override
    public Result addPicture(Integer pictureType, MultipartFile file) {
        String url = ossUtil.uploadFile(file);
        Picture picture = new Picture();
        picture.setPictureAdminId(jwtTokenProvider.getAdminToken().getAdminId());
        picture.setPictureType(pictureType);
        picture.setPictureUrl(url);
        picture.setPictureUpBy(1);
        int result = pictureMapper.insert(picture);
        if (result==0){
            throw new RuntimeException("上传图片失败");
        }
        return new Result(true,"上传图片成功");
    }
    @Override
    public Result setDefault(Integer pictureId, Integer pictureType) {
        Integer result = null;
        Integer result1 = null;
//        若为用户默认头像
        if(pictureType==0){
            result = setMapper.updateUserImage(pictureId);
        }else if (pictureType==1){
//            若为聊天背景
            result = setMapper.updateBack(pictureId);
        }else if(pictureType==2){
//            若为机器人默认头像
            result = setMapper.updateRobotImage(pictureId);
        }else{
            result = setMapper.updateAdminImage(pictureId);
        }
        result1 = pictureMapper.changeType(pictureType,pictureId);
        if(result==0||result1==0){
            throw new RuntimeException("设置默认失败");
        }
        return new Result(true,"设置默认成功");
     }
     @Override
    public Result deletePicture(Integer pictureId, String userId,Integer pictureUpBy,Integer pictureType) {
        Set set = setMapper.selectById(1);
//        用户上传的用户头像
        if(pictureUpBy==0 && pictureType==0){
            userMapper.updateUserImage(userId,set.getSetUserImage());
        }else if(pictureUpBy==0 && pictureType==1){
//            用户上传的聊天背景
            userMapper.updateUserBack(userId,set.getSetBack());
        }else if(pictureUpBy==1 && pictureType==0){
//            管理员上传的用户头像
            userMapper.updateUserAvatar(pictureId,set.getSetUserImage());
        }else if(pictureUpBy==1 && pictureType==1){
//            管理员上传的聊天背景
            userMapper.updateBack(pictureId,set.getSetBack());
        }else if(pictureType==3) {
//            管理员头像
            adminMapper.updateAdminImage(pictureId,set.getSetAdminImage());
        }else{
//            机器人头像
            conversationMapper.updateRobotImage(pictureId,set.getSetRobotImage());
        }
        Integer result = pictureMapper.deleteById(pictureId);
        if(result==0){
            throw new RuntimeException("删除失败");
        }
        return new Result(true,"删除成功");
    }
    @Override
    public Result getDefaultSet() {
        System.out.println("start select set");
        Set result = setMapper.selectById(1);
        System.out.println(result);
        return new Result(true,result,"获取默认设置成功");
    }
}
