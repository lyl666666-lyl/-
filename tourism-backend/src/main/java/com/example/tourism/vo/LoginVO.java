package com.example.tourism.vo;

import com.example.tourism.entity.SysUser;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginVO {
    private String token;
    private SysUser user;
    private String role;
}