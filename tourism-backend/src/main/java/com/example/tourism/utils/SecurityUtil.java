package com.example.tourism.utils;

import com.example.tourism.exception.BusinessException;
import com.example.tourism.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
    public static UserPrincipal current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new BusinessException("请先登录");
        }
        return principal;
    }

    public static boolean isAdmin() {
        try { return "ADMIN".equals(current().getRole()); } catch (Exception e) { return false; }
    }
}