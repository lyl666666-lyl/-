package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("tour_order")
public class TourOrder {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long userId;
    private Long routeId;
    private Long packageId;
    private LocalDate travelDate;
    private Integer peopleCount;
    private BigDecimal totalAmount;
    private String contactName;
    private String contactPhone;
    private String status;
    private String returnReason;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}