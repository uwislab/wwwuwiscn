package com.funny.demo.service.userService;

import com.funny.demo.entity.LoginRequest;
import com.funny.demo.tools.Result;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface UserService {
//    Result login(Map<String,String> params);
    Result login(LoginRequest request);
    Result changeUserName(String userName);
    Result changeUserImage(MultipartFile multipartFile);
    Result changeUserBack(Integer userBack);
    Result changeUserSignature(String userSignature);
    Result changeUserSex(Integer userSex);
    Result getUserInfo();
    Result deleteUser();
    Result addUserBack(MultipartFile file);
    Result selectBackPicture();
    Result deleteUserBack(Integer userBack);

    Result applyUnfrozen();
}
