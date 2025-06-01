package com.funny.demo.service.adminService.iml;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.funny.demo.entity.Admin;
import com.funny.demo.entity.Picture;
import com.funny.demo.entity.Set;
import com.funny.demo.mapper.adminMapper.AdminMapper;
import com.funny.demo.mapper.adminMapper.PictureMapper;
import com.funny.demo.mapper.adminMapper.SetMapper;
import com.funny.demo.service.adminService.AdminService;
import com.funny.demo.tools.JwtTokenProvider;
import com.funny.demo.tools.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
import com.funny.demo.tools.OSSUtil;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;


@Service
public class AdminIml implements AdminService {
    @Autowired
    private AdminMapper adminMapper;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PictureMapper pictureMapper;
    @Autowired
    private SetMapper setMapper;
    @Autowired
    private OSSUtil ossUtil;
    @Override
    public Result login(String adminId, String adminPassword) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("admin_id", adminId);
        queryWrapper.eq("admin_password", adminPassword);
        Admin admin = adminMapper.selectOne(queryWrapper);
        if(admin == null){
            return new Result(false, "账号或密码错误");
        }
        String token = jwtTokenProvider.createAdiminToken(adminId);
        admin.setToken(token);
        String url = pictureMapper.getUrlById(admin.getAdminImage());
        admin.setAdminImageUrl(url);
        return new Result(true, admin,"登录成功！");
    }
    @Override
    public Result addAdmin(String adminName) {
        Set set = setMapper.selectById(1);
        Admin admin = new Admin();
        String adminId = this.createAdminId();
        admin.setAdminId(adminId);
        admin.setAdminName(adminName);
        admin.setAdminPassword("123456");
        admin.setAdminImage(set.getSetAdminImage());
        int result = adminMapper.insert(admin);
        if(result == 0){
            return new Result(false,"添加管理员失败");
        }
        return new Result(true, admin,"添加管理员成功");
    }
    public String createAdminId(){
        StringBuilder sb=new StringBuilder();
        //8位日期
        String date=new SimpleDateFormat("yyyyMMdd").format(new Date());
        sb.append(date);
        Random r = new Random();
        // 生成一个4位的随机数并将其转换为至少四位的字符串形式，用于确保ID的唯一性和随机
        int number = r.nextInt(10000);
        sb.append(String.format("%04d",number).toString());
        // 检查生成的管理员ID是否已存在于数据库中，如果存在则递归调用本方法重新生成
        if(adminMapper.selectById(sb.toString())!=null){
            return createAdminId();
        }
        return sb.toString();
    }
    @Override
    public Result deleteAdmin(String adminId) {
        int result = adminMapper.deleteById(adminId);
        if(result == 0){
            return new Result(false,"删除管理员失败");
        }
        return new Result(true, "删除管理员成功");
    }
    @Override
    public Result changeAdminPassword(String adminPassword) {
        String adminId = jwtTokenProvider.getAdminToken().getAdminId();
        int result = adminMapper.changeAdminPassword(adminId, adminPassword);
        if(result == 0){
            return new Result(false,"修改管理员密码失败");
        }
        return new Result(true, "修改管理员密码成功");
    }
    @Override
    public Result changeAdmin(String adminEmail,String adminPhone) {
        String adminId = jwtTokenProvider.getAdminToken().getAdminId();
        int result = adminMapper.changeAdmin(adminId, adminEmail, adminPhone);
        if(result == 0){
            return new Result(false,"修改管理员邮箱失败");
        }
        return new Result(true, "修改管理员邮箱成功");
    }
    @Override
    public Result getAllAdmin(Integer currentPage, Integer pageSize) {
        if (currentPage == null || currentPage <= 0) {
            return new Result(false, null, "当前页码无效");
        }
        try {
            // 创建分页对象
            Page<Admin> page = new Page<>(currentPage, pageSize);
            // 使用分页查询
            Page<Admin> result = adminMapper.selectPage(page, new QueryWrapper<Admin>().ne("admin_id", "root"));
            // 返回结果
            return new Result(true, result, "获取管理员列表成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, null, "获取管理员列表失败：" + e.getMessage());
        }
    }
    @Override
    public Result changeAdminImage(MultipartFile file) {
        try{
            String adminId = jwtTokenProvider.getAdminToken().getAdminId();
            String url = ossUtil.uploadFile(file);
            Picture picture = new Picture();
            picture.setPictureAdminId(adminId);
//            设置图片类型为管理员头像
            picture.setPictureType(3);
            picture.setPictureUrl(url);
//            设置为管理员上传
            picture.setPictureUpBy(1);
            pictureMapper.insert(picture);
            int pictureId = pictureMapper.getIdByUrl(url);
            adminMapper.changeAdminImage(pictureId, adminId);
            return new Result(true, url,"上传图片成功");
        }catch (Exception e){
            e.printStackTrace();
            return new Result(false, "上传图片失败");
        }
    }
    @Override
    public Result selectAdmin(String adminName, Integer currentPage, Integer pageSize) {
        if (currentPage == null || currentPage <= 0) {
            return new Result(false, null, "当前页码无效");
        }
        try {
            // 创建分页对象
            Page<Admin> page = new Page<>(currentPage, pageSize);
            // 使用分页查询
            Page<Admin> result = adminMapper.selectPage(page, new QueryWrapper<Admin>().eq("admin_name", adminName));
            // 返回结果
            return new Result(true, result, "获取管理员列表成功");
        } catch (Exception e) {
            // 异常处理
            e.printStackTrace();
            return new Result(false, null, "获取管理员列表失败：" + e.getMessage());
        }
    }
}
