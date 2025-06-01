package com.funny.demo.controller.adminController;

import com.funny.demo.tools.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import com.funny.demo.service.adminService.PictureService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/funnyManage/picture")
public class PictureController {
    @Resource
    private PictureService pictureService;
    // 获取图片列表
    @GetMapping("/getAvatar")
    public Result getAvatar(@RequestParam Integer currentPage,@RequestParam Integer pictureType,@RequestParam Integer pageSize,@RequestParam Integer pictureUpBy)
    {
        return pictureService.getAvatar(currentPage,pictureType,pageSize,pictureUpBy);
    }
    // 添加图片
    @PostMapping("/addPicture")
    public Result addPicture(@RequestParam Integer pictureType,@RequestBody MultipartFile file)
    {
        return pictureService.addPicture(pictureType,file);
    }
//   设置默认图片
    @PutMapping("/setDefault")
    public Result setDefault(@RequestParam Integer pictureId,@RequestParam Integer pictureType)
    {
        return pictureService.setDefault(pictureId,pictureType);
    }
//    删除图片
    @DeleteMapping("/deleteUserPicture")
    public Result deleteUserPicture(@RequestParam Integer pictureId,@RequestParam String userId,@RequestParam Integer pictureUpBy,@RequestParam Integer pictureType)
    {
        return pictureService.deletePicture(pictureId,userId,pictureUpBy,pictureType);
    }
//    获取默认设置的图片信息
    @GetMapping("/getDefaultSet")
    public Result getDefaultSet()
    {
        return pictureService.getDefaultSet();
    }

}
