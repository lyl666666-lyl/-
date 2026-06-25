package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("order_traveler")
public class OrderTraveler {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private Long travelerId;
    private String travelerName;
    private String idCard;
    private String phone;
}