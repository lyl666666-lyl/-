package com.example.tourism.controller;

import com.example.tourism.common.Result;
import com.example.tourism.dto.PasswordRequest;
import com.example.tourism.entity.SysUser;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.SysUserService;
import com.example.tourism.utils.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final SysUserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public Result<SysUser> profile() {
        SysUser user = userService.getById(SecurityUtil.current().getId());
        user.setPassword(null);
        return Result.ok(user);
    }

    @PutMapping("/profile")
    public Result<Void> update(@RequestBody SysUser body) {
        SysUser user = userService.getById(SecurityUtil.current().getId());
        user.setRealName(body.getRealName());
        user.setPhone(body.getPhone());
        user.setEmail(body.getEmail());
        user.setAvatar(body.getAvatar());
        user.setUpdateTime(LocalDateTime.now());
        userService.updateById(user);
        return Result.ok();
    }

    @PutMapping("/password")
    public Result<Void> password(@Valid @RequestBody PasswordRequest req) {
        SysUser user = userService.getById(SecurityUtil.current().getId());
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) throw new BusinessException("旧密码错误");
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setUpdateTime(LocalDateTime.now());
        userService.updateById(user);
        return Result.ok();
    }
}