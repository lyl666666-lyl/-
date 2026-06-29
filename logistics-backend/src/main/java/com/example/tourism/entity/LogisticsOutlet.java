package com.example.tourism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("logistics_outlet")
public class LogisticsOutlet {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String contactPhone;
    private String address;
    private String status; // ENABLE, DISABLE
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
