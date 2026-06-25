package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("travel_route")
public class TravelRoute {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String routeName;
    private Long spotId;
    private Integer days;
    private BigDecimal price;
    private Integer maxPeople;
    private String coverImage;
    private String itinerary;
    private String description;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}