package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("guide")
public class Guide {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String phone;
    private String level;
    private String status;
}