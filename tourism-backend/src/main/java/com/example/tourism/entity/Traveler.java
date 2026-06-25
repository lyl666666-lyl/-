package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("traveler")
public class Traveler {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String name;
    private String gender;
    private String idCard;
    private String phone;
    private String remark;
    private LocalDateTime createTime;
}