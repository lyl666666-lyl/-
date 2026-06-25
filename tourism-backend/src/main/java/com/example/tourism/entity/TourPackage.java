package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("tour_package")
public class TourPackage {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long routeId;
    private String packageName;
    private String packageType;
    private BigDecimal price;
    private String includeService;
    private String excludeService;
    private String status;
    private LocalDateTime createTime;
}