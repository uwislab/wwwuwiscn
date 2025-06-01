package com.funny.demo.service.adminService;

import com.funny.demo.tools.Result;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public interface PictureService {
    Result getAvatar(Integer currentPage, Integer pictureType, Integer pageSize, Integer pictureUpBy);

    Result addPicture(Integer pictureType, MultipartFile file);

    Result setDefault(Integer pictureId,Integer pictureType);

    Result deletePicture(Integer pictureId, String userId,Integer pictureUpBy,Integer pictureType);

    Result getDefaultSet();
}
