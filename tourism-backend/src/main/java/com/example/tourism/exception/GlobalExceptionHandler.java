package com.example.tourism.exception;

import com.example.tourism.common.Result;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public Result<Void> business(BusinessException e) { return Result.fail(e.getMessage()); }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> valid(MethodArgumentNotValidException e) {
        return Result.fail(e.getBindingResult().getFieldError() == null ? "参数校验失败" : e.getBindingResult().getFieldError().getDefaultMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> denied() { return Result.forbidden("无权限访问"); }

    @ExceptionHandler(Exception.class)
    public Result<Void> error(Exception e) {
        e.printStackTrace();
        return Result.fail(e.getMessage());
    }
}