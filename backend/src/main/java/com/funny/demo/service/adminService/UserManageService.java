package com.funny.demo.service.adminService;

import com.funny.demo.entity.SelectUser;
import com.funny.demo.tools.Result;

public interface UserManageService {
    Result getAllUser(Integer currentPage, Integer pageSize);

    Result selectUser(SelectUser selectUser);

    Result getUserAvatar(Integer pictureId);

    Result frozenUser(String userId);

    Result frozenUsers();

    Result unfrozenUser(String userId);

    Result unfrozenUsers();
}
