package com.example.tourism.dto;

import jakarta.validation.constraints.*; import java.time.LocalDate; import java.util.List;
import lombok.Data;

@Data
public class OrderUpdateRequest {
    @NotNull private LocalDate travelDate;
    @Min(value = 1, message = "预订人数必须大于0") private Integer peopleCount;
    private Long packageId;
    @NotBlank private String contactName;
    @NotBlank private String contactPhone;
    @NotEmpty private List<Long> travelerIds;
}