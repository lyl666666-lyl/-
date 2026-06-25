package com.example.tourism.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.LoginRequest;
import com.example.tourism.dto.RegisterRequest;
import com.example.tourism.entity.SysUser;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.SysUserService;
import com.example.tourism.utils.JwtUtil;
import com.example.tourism.vo.LoginVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final SysUserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginRequest req) {
        SysUser user = userService.getOne(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, req.getUsername()));
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) throw new BusinessException("用户名或密码错误");
        if (!"ENABLE".equals(user.getStatus())) throw new BusinessException("账号已禁用");
        String token = jwtUtil.generate(user.getId(), user.getUsername(), user.getRole());
        user.setPassword(null);
        return Result.ok(new LoginVO(token, user, user.getRole()));
    }

    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterRequest req) {
        long count = userService.count(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, req.getUsername()));
        if (count > 0) throw new BusinessException("用户名不能重复");
        SysUser user = new SysUser();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRealName(req.getRealName());
        user.setPhone(req.getPhone());
        user.setEmail(req.getEmail());
        user.setRole("TOURIST");
        user.setStatus("ENABLE");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userService.save(user);
        return Result.ok();
    }

    @PostMapping("/logout")
    public Result<Void> logout() { return Result.ok(); }
}