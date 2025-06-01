package com.funny.demo.service.adminService;

import com.funny.demo.tools.Result;
import org.springframework.web.multipart.MultipartFile;

public interface AdminService {
    Result login(String adminId, String adminPassword);

    Result addAdmin(String adminName);

    Result deleteAdmin(String adminId);

    Result changeAdminPassword(String adminPassword);

    Result getAllAdmin(Integer currentPage,Integer pageSize);

    Result changeAdmin(String adminEmail, String adminPhone);

    Result changeAdminImage(MultipartFile file);

    Result selectAdmin(String adminName,Integer currentPage, Integer pageSize);
}
