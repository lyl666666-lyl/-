package com.example.tourism.dto;

import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AfterSaleRequest {
    @NotNull private Long orderId;
    @NotBlank private String type;
    @NotBlank private String content;
}