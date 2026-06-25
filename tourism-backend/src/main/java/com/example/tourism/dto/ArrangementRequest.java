package com.example.tourism.dto;

import jakarta.validation.constraints.*; import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ArrangementRequest {
    @NotNull private Long orderId;
    @NotNull private Long guideId;
    @NotBlank private String batchNo;
    @NotNull private LocalDateTime departTime;
    @NotBlank private String gatherPlace;
    private String reminder;
}