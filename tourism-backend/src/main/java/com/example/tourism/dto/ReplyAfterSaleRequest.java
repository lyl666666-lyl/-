package com.example.tourism.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReplyAfterSaleRequest {
    @NotBlank private String status;
    private String reply;
}