package com.example.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.SysUser;
import com.example.tourism.mapper.SysUserMapper;
import com.example.tourism.service.SysUserService;
import org.springframework.stereotype.Service;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {
}