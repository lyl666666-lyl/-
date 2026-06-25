package com.example.tourism.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReturnOrderRequest {
    @NotBlank(message = "退回原因不能为空") private String reason;
}